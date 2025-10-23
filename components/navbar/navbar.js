const homeBtnId = "nav-btn-home";
const expansionId = "nav-expansion-labels";
const contentContainerId = "content-container";

const contentContainerElem = document.getElementById(contentContainerId);
let homeButtonElem;
let expandedElem;

let navCollapsedState = true;
const navCollapsedClass = "nav__expansion--hidden";
const outsideClickCollapseTrigger = () => {
  expandedElem.classList.add(navCollapsedClass);
  navCollapsedState = true;

  contentContainerElem.removeEventListener(
    "click",
    outsideClickCollapseTrigger
  );

  console.log("Content collapse trigger set " + navCollapsedState);
};

async function initNavbar() {
  homeButtonElem = document.getElementById(homeBtnId);
  expandedElem = document.getElementById(expansionId);

  expansionToggleListener();
  initCarousel();
}

function expansionToggleListener() {
  homeButtonElem.addEventListener("click", () => {
    expandedElem.classList.toggle(navCollapsedClass);
    navCollapsedState = !navCollapsedState;

    console.log("home trigger set to " + navCollapsedState);
    secondaryCollapseListener();
  });
}

function secondaryCollapseListener() {
  if (!navCollapsedState) {
    contentContainerElem.addEventListener("click", outsideClickCollapseTrigger);
  }
  if (navCollapsedState) {
    contentContainerElem.removeEventListener(
      "click",
      outsideClickCollapseTrigger
    );
  }
}

/*----------------------------------------------------------------------*/
/* WIP AREA */
/*----------------------------------------------------------------------*/
//TODO - major refactor on everything, and making helper functions so code will be usuable for both up and down
const btnNavUpID = "nav-btn-up";
const btnNavDownId = "nav-btn-down";

const carouselTopHidden = "nav__carousel--top-hidden";
const carouselBottomHidden = "nav__carousel--bottom-hidden";

let btnNavUpElem;
let btnNavDownElem;

const availableSpaces = 3;

function initCarousel() {
  btnNavDownElem = document.getElementById(btnNavDownId);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  carouselElems.forEach((ul) => {
    const liElems = ul.querySelectorAll("li");

    liElems.forEach((li, index) => {
      if (index < availableSpaces) {
        li.style.gridRow = (index + availableSpaces - 1).toString();
      } else {
        li.classList.add(carouselBottomHidden);
      }
    });
  });

  initBtnUp();
}

function initBtnUp() {
  btnNavUpElem = document.getElementById(btnNavUpID);
  const carouselElems = document.querySelectorAll(".nav__carousel");

  btnNavUpElem.addEventListener("click", () => {
    if (!canScrollDown(carouselElems)) {
      console.log("Cannot scroll down anymore");
      return;
    }
    carouselElems.forEach((ul) => {
      const lis = ul.querySelectorAll("li");
      let topSet = false;

      for (let i = 0; i < availableSpaces + 1; i++) {
        console.log("loop " + i);

        if (!lis[i].classList.contains(carouselTopHidden)) {
          lis[i].style.gridRow = lis[i].style.gridRow - 1;

          if (!topSet) lis[i].classList.add(carouselTopHidden);
          topSet = true;
        }

        if (lis[i].classList.contains(carouselBottomHidden)) {
          lis[i].classList.remove(carouselBottomHidden);
          lis[i].style.gridRow = 4;
          break;
        }
      }
    });
  });
}

function canScrollDown(ulElems) {
  return (
    ulElems[0].querySelectorAll("li").length > availableSpaces &&
    ulElems[0]
      .querySelector("ul li:last-child")
      .classList.contains(carouselBottomHidden)
  );
}