/* Element Id's*/
const homeBtnId = "nav-btn-home";
const navExpansionId = "nav-expansion-labels";
const contentContainerId = "content-container";

/* Element Classes */
const navCollapsedClass = "nav__expansion--hidden";

/* Elements */
const contentContainerElem = document.getElementById(contentContainerId);
let homeBtnElem;
let navExpansionElem;

/* Cheks booleans */
let navIsCollapsed = true;

/**
 * Logic for {@link addSecondaryNavbarCollapser}
 */
const collapseFromContainer = () => {
  navExpansionElem.classList.add(navCollapsedClass);
  navIsCollapsed = true;

  contentContainerElem.removeEventListener("click", collapseFromContainer);
};

/**
 * Initiate component on load
 */
function initNavbar() {
  homeBtnElem = document.getElementById(homeBtnId);
  navExpansionElem = document.getElementById(navExpansionId);

  initNavbarExpansionControl();
  initCarousel();
}

/**
 * Initiate event listener controlling
 * {@link navExpansionElem} state with {@link homeBtnElem}
 */
function initNavbarExpansionControl() {
  homeBtnElem.addEventListener("click", () => {
    navExpansionElem.classList.toggle(navCollapsedClass);
    navIsCollapsed = !navIsCollapsed;

    console.log("home trigger set to " + navIsCollapsed);
    addSecondaryNavbarCollapser();
  });
}

/**
 * Adds event listener to collapse
 * {@link navExpansionElem} from {@link contentContainerElem}
 */
function addSecondaryNavbarCollapser() {
  if (!navIsCollapsed) {
    contentContainerElem.addEventListener("click", collapseFromContainer);
  }
  if (navIsCollapsed) {
    contentContainerElem.removeEventListener("click", collapseFromContainer);
  }
}

/*----------------------------------------------------------------------*/
/* WIP AREA */
/*----------------------------------------------------------------------*/
//TODO - major refactor on everything, and making helper functions so code will be usuable for both up and down
const btnNavUpID = "nav-btn-up";
const btnNavDownId = "nav-btn-down";

const carouselTopOverflowClass = "nav__carousel--top-hidden";
const carouselBottomOverflowClass = "nav__carousel--bottom-hidden";

let btnNavUpElem;
let btnNavDownElem;

const moduleSpaces = 3;

function initCarousel() {
  btnNavDownElem = document.getElementById(btnNavDownId);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    liElems.forEach((li, index) => {
      if (index < moduleSpaces) {
        li.style.gridRow = (index + moduleSpaces - 1).toString();
      } else {
        li.classList.add(carouselBottomOverflowClass);
      }
    });
  });

  initBtnUp();
  initBtnDown();
}

/*BUTTON DOWN*/
function initBtnDown() {
  btnNavDownElem = document.getElementById(btnNavDownId);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  btnNavDownElem.addEventListener("click", () => {
    if (canScroll(carouselElems, btnNavDownElem))
      carouselDown(carouselElems, btnNavDownElem);
  });
}

function carouselDown(carouselElems, triggerElem) {
  console.log("Carousel down triggered");
  carouselElems.forEach((ul) => {
    const lis = ul.querySelectorAll("li");
    let bottomSet = false;

    if (triggerElem === btnNavDownElem) {
      for (let i = moduleSpaces; i => 0; i--) {
        console.log("reverse looping: " + 1);

        if (!lis[i].classList.contains(carouselBottomOverflowClass)) {
          lis[i].style.gridRow =
            (parseInt(lis[i].style.gridRow) || lis.length + 1) + 1;
          if (!bottomSet) {
            lis[i].classList.add(carouselBottomOverflowClass);
            bottomSet = true;
          }
        }

        if (lis[i].classList.contains(carouselTopOverflowClass)) {
          lis[i].classList.remove(carouselTopOverflowClass);
          lis[i].style.gridRow = 2;
          break;
        }
      }
    }
  });
}

function initBtnUp() {
  btnNavUpElem = document.getElementById(btnNavUpID);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  btnNavUpElem.addEventListener("click", () => {
    if (!canScroll(carouselElems, btnNavUpElem)) return;

    carouselElems.forEach((ul) => {
      const lis = ul.querySelectorAll("li");
      let topSet = false;

      for (let i = 0; i < moduleSpaces + 1; i++) {
        console.log("loop " + i);

        if (!lis[i].classList.contains(carouselTopOverflowClass)) {
          lis[i].style.gridRow = (parseInt(lis[i].style.gridRow) || 1) - 1;

          if (!topSet) {
            lis[i].classList.add(carouselTopOverflowClass);
            topSet = true;
          }
        }

        if (lis[i].classList.contains(carouselBottomOverflowClass)) {
          lis[i].classList.remove(carouselBottomOverflowClass);
          lis[i].style.gridRow = 4;
          break;
        }
      }
    });
  });
}

function canScroll(ulElems, triggerElem) {
  if (triggerElem === btnNavUpElem) {
    return (
      ulElems[0].querySelectorAll("li").length > moduleSpaces &&
      ulElems[0]
        .querySelector("ul li:last-child")
        .classList.contains(carouselBottomOverflowClass)
    );
  }
  if (triggerElem === btnNavDownElem) {
    return (
      ulElems[0].querySelectorAll("li").length > moduleSpaces &&
      ulElems[0]
        .querySelector("ul li:first-child")
        .classList.contains(carouselTopOverflowClass)
    );
  }
}
