import { loadComponent } from "./app.js";
import {
  init as initNavbar,
  populateCarousel,
} from "./components/navbar/navbar.js";
import { init as initHome } from "./modules/home/home.js";
import { init as initClicker } from "./modules/clicker/clicker.js";

const modules = [
  { name: "home", loader: loadHome },
  { name: "clicker", loader: loadClicker },
];

init();

function init() {
  loadNavbar();
  loadHome();
}

function loadNavbar() {
  try {
    loadComponent("navbar")
      .then(() => populateCarousel(modules))
      .then(() => initNavbar());
  } catch (error) {
    console.error(`Failed to load navbar: ${error}`);
  }
}

function loadHome() {
  try {
    loadComponent("home").then(() => initHome());
  } catch (error) {
    console.error(`Failed to load home: ${error}`);
  }
}

function loadClicker() {
  try {
    loadComponent("clicker").then(() => initClicker());
  } catch (error) {
    console.error(`Failed to load clicker: ${error}`);
  }
}
