import {
  CURRENT_MODULE_KEY,
  PNG_FILE_EXTENSION,
} from "../../shared/constants.js";
import {
  getFilePathFromRoot,
  firstLetterToUpper,
  getElemById,
} from "../../shared/services.js";

const navContainerId = "navbar-container";
const menuBtnId = "nav-btn-menu";
const navExpansionId = "nav-expansion";
const contentContainerId = "main-container";
const btnNavPrevId = "nav-btn-prev";
const btnNavNextId = "nav-btn-next";

const navCollapsedClass = "nav__expansion--hidden";
const carouselHiddenItemClass = "nav__carousel--hidden";

let menuBtnElem;
let navExpansionElem;
let btnNavPrevElem;
let btnNavNextElem;
let carouselElems;

let maxWidthQuery;
let isNavCollapsed = true;

const carouselSlotCount = 3;
let carouselModuleCount;

export function init() {
  cacheNavElems();
  initNavbarCollapseControl();
  initCarousel();
  breakpointChangeHandler();
}

function cacheNavElems() {
  menuBtnElem = getElemById(menuBtnId);
  navExpansionElem = getElemById(navExpansionId);
  maxWidthQuery = window.matchMedia("(max-width: 768px)");
  carouselElems = document.querySelectorAll(".nav__carousel");
}

function breakpointChangeHandler() {
  maxWidthQuery.addEventListener("change", () => {
    const navContainer = getElemById(navContainerId);
    navContainer.classList.add("transitions--disabled");

    // Double call to guard against flicker for redundancy
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navContainer.classList.remove("transitions--disabled");
      });
    });
  });
}

export function updateNavState(moduleObjArray) {
  const sessionModule = sessionStorage.getItem(CURRENT_MODULE_KEY) || "home";
  getElemById("nav-current-module").textContent =
    firstLetterToUpper(sessionModule);

  moduleObjArray.forEach((module) => {
    setModuleBtnState(getElemById(module.name + "-icon"), false, "icon");
    setModuleBtnState(getElemById(module.name + "-title"), false, "title");
  });

  const currentModuleObj = moduleObjArray.find((m) => m.name === sessionModule);
  if (!currentModuleObj) return;

  setModuleBtnState(getElemById(currentModuleObj.name + "-icon"), true, "icon");
  setModuleBtnState(
    getElemById(currentModuleObj.name + "-title"),
    true,
    "title"
  );

  collapseNavExpansion();
}

function setModuleBtnState(btnElem, isActive, type) {
  if (!btnElem) return;
  btnElem.disabled = isActive;
  btnElem.classList.toggle(`nav__${type}--current`, isActive);
}

/*----------------------------------------------------------------------*/
/*                              Expansion                               */
/*----------------------------------------------------------------------*/
function initNavbarCollapseControl() {
  menuBtnElem.addEventListener("click", () => {
    navExpansionElem.classList.toggle(navCollapsedClass);
    isNavCollapsed = !isNavCollapsed;
    menuBtnElem.classList.toggle("nav__icon--current", !isNavCollapsed);

    setContentContainerClickListener();
  });
}

function collapseNavExpansion() {
  if (isNavCollapsed) return;

  navExpansionElem.classList.add(navCollapsedClass);
  isNavCollapsed = true;
  menuBtnElem.classList.remove("nav__icon--current");

  const contentContainerElem = getElemById(contentContainerId);
  contentContainerElem.removeEventListener("click", collapseNavExpansion);
}

function setContentContainerClickListener() {
  const contentContainerElem = getElemById(contentContainerId);
  if (!contentContainerElem) return;

  if (!isNavCollapsed) {
    contentContainerElem.addEventListener("click", collapseNavExpansion);
  } else {
    contentContainerElem.removeEventListener("click", collapseNavExpansion);
  }
}

/*----------------------------------------------------------------------*/
/*                              Carousel                                */
/*----------------------------------------------------------------------*/
export function populateCarousel(moduleObjArray) {
  if (!Array.isArray(moduleObjArray))
    throw new Error("populateCarousel: invalid modules array");
  carouselModuleCount = moduleObjArray.length;

  // Destructure to access only the properties needed locally
  moduleObjArray.forEach(({ name, loader }, i) => {
    moduleObjectValidator({ name, loader }, i);

    appendToCarousel({ name, loader }, "nav-carousel-icon");
    appendToCarousel({ name, loader }, "nav-carousel-title");
  });
}

function moduleObjectValidator(moduleObj, i) {
  if (
    !moduleObj ||
    typeof moduleObj.name !== "string" ||
    moduleObj.name.length === 0
  )
    throw new Error(
      `populateCarousel: moduleObjArray[${i}].name is not a valid string`
    );
  if (typeof moduleObj.loader !== "function")
    throw new Error(`populateCarousel: ${moduleObj.name} has invalid loader`);
}

function appendToCarousel(moduleObj, carouselId) {
  const carouselElem = getElemById(carouselId);
  const liElem = document.createElement("li");
  const btnElem = document.createElement("button");
  btnElem.addEventListener("click", () => moduleObj.loader());

  const hasIcon = carouselId === "nav-carousel-icon";

  if (hasIcon) {
    const imgElem = document.createElement("img");
    imgElem.src = getFilePathFromRoot(moduleObj.name, PNG_FILE_EXTENSION);

    btnElem.appendChild(imgElem);
    btnElem.classList.add("nav__icon");
    btnElem.id = `${moduleObj.name}-icon`;
  } else {
    btnElem.textContent = firstLetterToUpper(moduleObj.name);
    btnElem.id = `${moduleObj.name}-title`;
  }
  liElem.appendChild(btnElem);
  carouselElem.appendChild(liElem);
}

function initCarousel() {
  btnNavPrevElem = getElemById(btnNavPrevId);
  btnNavNextElem = getElemById(btnNavNextId);

  const navElem = document.querySelector("nav");

  if (carouselModuleCount < carouselSlotCount) {
    navElem.style.setProperty("--carousel-slot-count", carouselModuleCount);

    btnNavPrevElem.classList.add("nav__arrow--hidden");
    btnNavNextElem.classList.add("nav__arrow--hidden");
  } else {
    navElem.style.setProperty("--carousel-slot-count", carouselSlotCount);

    setCarouselScrollListeners();
  }

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    liElems.forEach((li, i) => {
      if (i >= carouselSlotCount) li.classList.add(carouselHiddenItemClass);
    });
  });
}

function setCarouselScrollListeners() {
  btnNavPrevElem.addEventListener("click", () => {
    if (!canScroll(btnNavPrevElem)) return;

    scrollCarousel(btnNavPrevElem);
  });

  btnNavNextElem.addEventListener("click", () => {
    if (!canScroll(btnNavNextElem)) return;

    scrollCarousel(btnNavNextElem);
  });
}

function canScroll(triggerElem) {
  const hasOverflow = carouselElems[0].children.length > carouselSlotCount;

  if (!hasOverflow) return false;

  if (triggerElem === btnNavNextElem) {
    return carouselElems[0].lastElementChild.classList.contains(
      carouselHiddenItemClass
    );
  }
  if (triggerElem === btnNavPrevElem) {
    return carouselElems[0].firstElementChild.classList.contains(
      carouselHiddenItemClass
    );
  }

  return false;
}

function scrollCarousel(triggerElem) {
  const isScrollingNext = triggerElem === btnNavNextElem;

  carouselElems.forEach((ul) => {
    const liElems = ul.children;

    const start = isScrollingNext ? 0 : liElems.length - 1;
    const end = isScrollingNext ? liElems.length : -1;
    const step = isScrollingNext ? 1 : -1;

    for (let i = start; i !== end; i += step) {
      const li = liElems[i];
      if (!li.classList.contains(carouselHiddenItemClass)) {
        li.classList.add(carouselHiddenItemClass);

        const nextTargetIndex =
          i + (isScrollingNext ? carouselSlotCount : -carouselSlotCount);

        const targetLi = liElems[nextTargetIndex];
        if (targetLi) targetLi.classList.remove(carouselHiddenItemClass);
        break;
      }
    }
  });
}
