const homeBtnId = "nav-btn-home";
const navExpansionId = "nav-expansion";
const contentContainerId = "content-container";
const btnNavUpId = "nav-btn-up";
const btnNavDownId = "nav-btn-down";

const navCollapsedClass = "nav__expansion--hidden";
const carouselTopOverflowClass = "nav__carousel--top-hidden";
const carouselBottomOverflowClass = "nav__carousel--bottom-hidden";

const contentContainerElem = document.getElementById(contentContainerId);
let homeBtnElem;
let navExpansionElem;
let btnNavUpElem;
let btnNavDownElem;

let navIsCollapsed = true;

const carouselModuleSlots = 3;

/**
 * Initiate component on load
 */
function initNavbar() {
  homeBtnElem = document.getElementById(homeBtnId);
  navExpansionElem = document.getElementById(navExpansionId);

  initNavbarCollapseControl();
  initCarouselControl();
}

/**
 * Initiate event listener controling
 * {@link navExpansionElem} state with {@link homeBtnElem}
 */
function initNavbarCollapseControl() {
  homeBtnElem.addEventListener("click", () => {
    navExpansionElem.classList.toggle(navCollapsedClass);
    navIsCollapsed = !navIsCollapsed;

    collapseFromContainerClick();
  });
}

/**
 * Adds event listener to collapse
 * {@link navExpansionElem} from {@link contentContainerElem}
 */
function collapseFromContainerClick() {
  contentContainerElem[
    navIsCollapsed ? "removeEventListener" : "addEventListener"
  ]("click", collapseFromContainerClickLogic);
}

/**
 * Logic for {@link collapseFromContainerClick}
 */
const collapseFromContainerClickLogic = () => {
  navExpansionElem.classList.add(navCollapsedClass);
  navIsCollapsed = true;

  contentContainerElem.removeEventListener(
    "click",
    collapseFromContainerClickLogic
  );
};

/**
 * Assigns grid-row to list elements and calls to add listeners
 * to manipulate content in module carousels
 */
function initCarouselControl() {
  carouselScrollListeners();

  btnNavDownElem = document.getElementById(btnNavDownId);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    liElems.forEach((li, i) => {
      if (i < carouselModuleSlots) {
        li.style.gridRow = (i + carouselModuleSlots - 1).toString();
      } else {
        li.classList.add(carouselBottomOverflowClass);
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
  if (triggerElem === btnNavUpElem) {
    return (
      carouselElems[0].querySelectorAll("li").length > carouselModuleSlots &&
      carouselElems[0]
        .querySelector("ul li:last-child")
        .classList.contains(carouselBottomOverflowClass)
    );
  }
  if (triggerElem === btnNavDownElem) {
    return (
      carouselElems[0].querySelectorAll("li").length > carouselModuleSlots &&
      carouselElems[0]
        .querySelector("ul li:first-child")
        .classList.contains(carouselTopOverflowClass)
    );
  }

  return false;
}

/**
 * Adds event listeners to {@link btnNavUpElem} and {@link btnNavDownElem}
 * to control all nav carousels in sync
 */
function carouselScrollListeners() {
  btnNavUpElem = document.getElementById(btnNavUpId);
  btnNavDownElem = document.getElementById(btnNavDownId);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  btnNavUpElem.addEventListener("click", () => {
    if (!canScroll(carouselElems, btnNavUpElem)) {
      return;
    }

    scrollCarousel(carouselElems, btnNavUpElem);
  });

  btnNavDownElem.addEventListener("click", () => {
    if (!canScroll(carouselElems, btnNavDownElem)) {
      return;
    }

    scrollCarousel(carouselElems, btnNavDownElem);
  });
}

/**
 * Repositions the li children of {@link carouselElems} in the carousel
 * based on {@link triggerElem} direction
 * @param {Array<HTMLElement>} carouselElems - List of nav carousel(s)
 * @param {HTMLElement} triggerElem - The button trigger
 */
function scrollCarousel(carouselElems, triggerElem) {
  const moveDown = triggerElem === btnNavDownElem;

  const carouselFirstPosition = 2;
  const carouselLastPosition = carouselModuleSlots + 1;

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    const start = moveDown ? liElems.length - 1 : 0;
    const end = moveDown ? -1 : liElems.length;
    const step = moveDown ? -1 : 1;

    const overflowClassToAdd = moveDown
      ? carouselBottomOverflowClass
      : carouselTopOverflowClass;

    const overflowClassToRemove = moveDown
      ? carouselTopOverflowClass
      : carouselBottomOverflowClass;

    const defaultGridRow = moveDown
      ? carouselFirstPosition
      : carouselLastPosition;

    let overFlowSet = false;

    for (let i = start; i !== end; i += step) {
      const li = liElems[i];

      if (!li.classList.contains(overflowClassToAdd)) {
        li.style.gridRow = parseInt(li.style.gridRow) - step;

        if (!overFlowSet) {
          li.classList.add(overflowClassToAdd);
          overFlowSet = true;
        }
      }

      if (li.classList.contains(overflowClassToRemove)) {
        li.classList.remove(overflowClassToRemove);
        li.style.gridRow = defaultGridRow;
        break;
      }
    }
  });
}
