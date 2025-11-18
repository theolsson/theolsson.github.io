import { CURRENT_MODULE_KEY } from "./shared/constants.js";
import { loadModule } from "./app.js";
import {
  init as initNavbar,
  populateCarousel,
  updateNavState,
} from "./components/navbar/navbar.js";
import { init as initHome } from "./modules/home/home.js";
import { init as initClicker } from "./modules/clicker/clicker.js";

const modules = [
  { name: "home", loader: loadHome, init: initHome },
  { name: "clicker", loader: loadClicker, init: initClicker },
];

init();

async function init() {
  try {
    await loadNavbar();

    const moduleToLoad = getInitialModule();
    await moduleToLoad.loader();
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

function getInitialModule(){
  const sessionModule = sessionStorage.getItem(CURRENT_MODULE_KEY);
  return modules.find((m) => m.name === sessionModule) || modules[0];
}

async function loadNavbar() {
  try {
    await loadModule("navbar");

    populateCarousel(modules);
    initNavbar();
  } catch (error) {
    console.error(`Failed to load navbar: ${error}`);
    throw error;
  }
}

async function baseModuleLoader(moduleObj) {
  try {
    await loadModule(moduleObj.name);
    moduleObj.init();
    sessionStorage.setItem(CURRENT_MODULE_KEY, moduleObj.name);
    updateNavState(modules);
  } catch (error) {
    console.error(`Failed to load ${moduleObj.name}:`, error);
    throw error;
  }
}

function loadHome() {
  return baseModuleLoader(modules.find((m) => m.name === "home"));
}

function loadClicker() {
  return baseModuleLoader(modules.find((m) => m.name === "clicker"));
}
