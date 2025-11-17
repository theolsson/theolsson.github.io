import {
  getFilePathFromRoot,
  firstLetterToUpper,
} from "../../shared/services.js";

const navParentId = "navbar-container";
const menuBtnId = "nav-btn-menu";
const navExpansionId = "nav-expansion";
const contentContainerId = "main-container";
const btnNavPrevId = "nav-btn-prev";
const btnNavNextId = "nav-btn-next";

const navCollapsedClass = "nav__expansion--hidden";
const carouselFirstPositionClass = "nav__carousel--first";
const carouselSecondPositionClass = "nav__carousel--second";
const carouselThirdPositionClass = "nav__carousel--third";
const carouselHiddenPositionClass = "nav__carousel--hidden";

let menuBtnElem;
let navExpansionElem;
let btnNavPrevElem;
let btnNavNextElem;

const maxWidthQuery = window.matchMedia("(max-width: 768px)");
let navIsCollapsed = true;

const carouselModuleSlots = 3;
let carouselModuleCount;

/**
 * Initiate component on load
 */
export function init() {
  menuBtnElem = document.getElementById(menuBtnId);
  navExpansionElem = document.getElementById(navExpansionId);

  initNavbarCollapseControl();
  initCarousel();

  handleBreakpointChange();
}

function handleBreakpointChange() {
  maxWidthQuery.addEventListener("change", () => {
    const navParentElem = document.getElementById(navParentId);
    if (!navParentElem) return;

    navParentElem.classList.add("transitions--disabled");
    void navParentElem.offsetHeight;

    setTimeout(() => {
      navParentElem.classList.remove("transitions--disabled");
    }, 100);
  });
}

/**
 * Adds event listener to collapse
 * {@link navExpansionElem} from element with {@link contentContainerId}
 */
function collapseFromContainerClick() {
  const contentContainerElem = document.getElementById(contentContainerId);
  contentContainerElem[
    navIsCollapsed ? "removeEventListener" : "addEventListener"
  ]("click", collapseFromContainerClickLogic);
}

/**
 * Initiate event listener controling
 * {@link navExpansionElem} state with {@link menuBtnElem}
 */
function initNavbarCollapseControl() {
  menuBtnElem.addEventListener("click", () => {
    navExpansionElem.classList.toggle(navCollapsedClass);
    navIsCollapsed = !navIsCollapsed;
    navIsCollapsed
      ? menuBtnElem.classList.remove("nav__icon--current")
      : menuBtnElem.classList.add("nav__icon--current");

    collapseFromContainerClick();
  });
}

/**
 * Logic for {@link collapseFromContainerClick}
 */
const collapseFromContainerClickLogic = () => {
  navExpansionElem.classList.add(navCollapsedClass);
  navIsCollapsed = true;

  const contentContainerElem = document.getElementById(contentContainerId);
  contentContainerElem.removeEventListener(
    "click",
    collapseFromContainerClickLogic
  );
  menuBtnElem.classList.remove("nav__icon--current");
};

/*----------------------------------------------------------------------*/
/*                              Carousel                                */
/*----------------------------------------------------------------------*/

export function populateCarousel(moduleObjArray) {
  carouselModuleCount = moduleObjArray.length;

  moduleObjArray.forEach((moduleObj) => {
    appendCarouselElem(moduleObj, "nav-carousel-icon");
    appendCarouselElem(moduleObj, "nav-carousel-title");
  });
}

function appendCarouselElem(moduleObj, parentId) {
  const parent = document.getElementById(parentId);
  const liElem = document.createElement("li");
  const btnElem = document.createElement("button");
  btnElem.addEventListener("click", () => moduleObj.loader());

  const hasIcon = parentId === "nav-carousel-icon";

  if (hasIcon) {
    const imgElem = document.createElement("img");
    imgElem.src = getFilePathFromRoot(moduleObj.name, ".png");

    btnElem.appendChild(imgElem);
    btnElem.classList.add("nav__icon");
    btnElem.id = moduleObj.name + "-icon";
  } else {
    btnElem.textContent = firstLetterToUpper(moduleObj.name);
    btnElem.id = moduleObj.name + "-title";
  }
  liElem.appendChild(btnElem);
  parent.appendChild(liElem);
}

/**
 * Assigns grid-row to list elements and calls to add listeners
 * to manipulate content in module carousels
 */
function initCarousel() {
  btnNavPrevElem = document.getElementById(btnNavPrevId);
  btnNavNextElem = document.getElementById(btnNavNextId);

  if (carouselModuleCount < carouselModuleSlots) {
    btnNavPrevElem.classList.add("nav__arrow--hidden");
    btnNavNextElem.classList.add("nav__arrow--hidden");
  } else {
    carouselScrollListeners();
  }

  const carouselElems = document.querySelectorAll(".nav__carousel");

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    liElems.forEach((li, i) => {
      switch (i) {
        case 0:
          li.classList.add(carouselFirstPositionClass);
          break;
        case 1:
          li.classList.add(carouselSecondPositionClass);
          break;
        case 2:
          li.classList.add(carouselThirdPositionClass);
          break;
        default:
          li.classList.add(carouselHiddenPositionClass);
          break;
      }
    });
  });
}

/**
 * Check if overflow is available to move into top or bottom position
 * based on {@link triggerElem}
 * @param {Array<HTMLElement>} carouselElems - List of nav carousel(s)
 * @param {HTMLElement} triggerElem - The button trigger
 * @returns {boolean}
 */
function canScroll(carouselElems, triggerElem) {
  const hasContentToScroll =
    carouselElems[0].querySelectorAll("li").length > carouselModuleSlots;

  if (triggerElem === btnNavNextElem) {
    return (
      hasContentToScroll &&
      carouselElems[0]
        .querySelector("li:last-child")
        .classList.contains(carouselHiddenPositionClass)
    );
  }
  if (triggerElem === btnNavPrevElem) {
    return (
      hasContentToScroll &&
      carouselElems[0]
        .querySelector("li:first-child")
        .classList.contains(carouselHiddenPositionClass)
    );
  }

  return false;
}

/**
 * Adds event listeners to {@link btnNavPrevElem} and {@link btnNavNextElem}
 * to control all nav carousels in sync
 */
function carouselScrollListeners() {
  const carouselElems = document.querySelectorAll(".nav__carousel");

  btnNavPrevElem.addEventListener("click", () => {
    if (!canScroll(carouselElems, btnNavPrevElem)) {
      return;
    }

    scrollCarousel(carouselElems, btnNavPrevElem);
  });

  btnNavNextElem.addEventListener("click", () => {
    if (!canScroll(carouselElems, btnNavNextElem)) return;

    scrollCarousel(carouselElems, btnNavNextElem);
  });
}

/**
 * Repositions the li children of {@link carouselElems} in the carousel
 * based on {@link triggerElem} direction
 * @param {Array<HTMLElement>} carouselElems - List of nav carousel(s)
 * @param {HTMLElement} triggerElem - The button trigger
 */
function scrollCarousel(carouselElems, triggerElem) {
  const moveDown = triggerElem === btnNavPrevElem;

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    const start = moveDown ? liElems.length - 1 : 0;
    const end = moveDown ? -1 : liElems.length;
    const step = moveDown ? -1 : 1;

    const firstPos = moveDown
      ? carouselThirdPositionClass
      : carouselFirstPositionClass;
    const secondPos = carouselSecondPositionClass;
    const thirdPos = moveDown
      ? carouselFirstPositionClass
      : carouselThirdPositionClass;

    let overflowSet = false;
    let counter = 0;

    for (let i = start; i !== end; i += step) {
      const li = liElems[i];

      if (!li.classList.contains(carouselHiddenPositionClass) || overflowSet) {
        switch (counter) {
          case 0:
            li.classList.remove(firstPos);
            li.classList.add(carouselHiddenPositionClass);
            overflowSet = true;
            break;

          case 1:
            li.classList.remove(secondPos);
            li.classList.add(firstPos);
            break;

          case 2:
            li.classList.remove(thirdPos);
            li.classList.add(secondPos);
            break;

          case 3:
            li.classList.remove(carouselHiddenPositionClass);
            li.classList.add(thirdPos);
            break;
        }
      }

      if (overflowSet) counter++;

      if (counter === carouselModuleSlots + 1) break;
    }
  });
}

export function updateNavState(moduleObjArray) {
  const sessionModule = sessionStorage.getItem("currentModule");
  document.getElementById("nav-current-module").textContent =
    firstLetterToUpper(sessionModule);

  moduleObjArray.forEach((module) => {
    const iconBtnElem = document.getElementById(module.name + "-icon");
    const titleBtnElem = document.getElementById(module.name + "-title");

    if (iconBtnElem) {
      iconBtnElem.disabled = false;
      iconBtnElem.classList.remove("nav__icon--current");
    }
    if (titleBtnElem) {
      titleBtnElem.disabled = false;
      titleBtnElem.classList.remove("nav__title--current");
    }
  });

  const currentModuleObj = moduleObjArray.find((m) => m.name === sessionModule);
  if (!currentModuleObj) return;

  const newModuleName = currentModuleObj.name;
  const btnToDisable = document.getElementById(newModuleName + "-icon");
  const titleToDisable = document.getElementById(newModuleName + "-title");

  btnToDisable.disabled = true;
  btnToDisable.classList.add("nav__icon--current");

  titleToDisable.disabled = true;
  titleToDisable.classList.add("nav__title--current");

  if (navIsCollapsed) return;

  navExpansionElem.classList.add(navCollapsedClass);
  navIsCollapsed = true;
  menuBtnElem.classList.remove("nav__icon--current");
  const contentContainerElem = document.getElementById(contentContainerId);
  if (contentContainerElem) {
    contentContainerElem.removeEventListener(
      "click",
      collapseFromContainerClickLogic
    );
  }
}
