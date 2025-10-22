const homeBtnId = "nav-btn-home";
const expansionId = "nav-expansion-labels";
const contentContainerId = "content-container";

const contentContainerElem = document.getElementById(contentContainerId);
let homeButtonElem;
let collapsableElem;

let navCollapsed = true;
const navCollapsedClass = "nav__expansion--hidden";
const outsideClickCollapseTrigger = () => {
  expandedElem.classList.add(navCollapsedClass);
  navCollapsed = true;
  
  contentContainerElem.removeEventListener("click", outsideClickCollapseTrigger);

  console.log("Content collapse trigger set " + navCollapsed);
};


async function initNavbar() {
  homeButtonElem = document.getElementById(homeBtnId);
  expandedElem = document.getElementById(expansionId);

  expansionToggleListener();
}

function expansionToggleListener() {
  homeButtonElem.addEventListener("click", () => {
    expandedElem.classList.toggle(navCollapsedClass);
    navCollapsed = !navCollapsed;

    console.log("home trigger set to " + navCollapsed);
    secondaryCollapseListener();
  });
}

function secondaryCollapseListener() {
  if (!navCollapsed) {
    contentContainerElem.addEventListener("click", outsideClickCollapseTrigger);
  }
  if (navCollapsed) {
    contentContainerElem.removeEventListener("click", outsideClickCollapseTrigger);
  }
}
