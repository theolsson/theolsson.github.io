const homeButtonId = "nav-home";
const collapseID = "nav-expanded";
const contentContainerId = "content-container";

const contentContainerElem = document.getElementById("content-container");
let homeButtonElem;
let collapsableElem;

let navbarCollapsed = true;
const navbarCollapsedClass = "hidden";

async function initNavbar() {
  homeButtonElem = document.getElementById(homeButtonId);
  expandedElem = document.getElementById(collapseID);

  expansionToggleListener();
}

function expansionToggleListener() {
  homeButtonElem.addEventListener("click", () => {
    expandedElem.classList.toggle(navbarCollapsedClass);
    navbarCollapsed = !navbarCollapsed;

    console.log("home trigger set to " + navbarCollapsed);
    secondaryCollapseListener();
  });
}

const collapseEvent = () => {
  expandedElem.classList.add(navbarCollapsedClass);
  navbarCollapsed = true;
  
  contentContainerElem.removeEventListener("click", collapseEvent);

  console.log("Content collapse trigger set " + navbarCollapsed);
};

function secondaryCollapseListener() {
  if (!navbarCollapsed) {
    contentContainerElem.addEventListener("click", collapseEvent);
  }
  if (navbarCollapsed) {
    contentContainerElem.removeEventListener("click", collapseEvent);
  }
}
