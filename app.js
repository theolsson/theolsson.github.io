import {getFilePathFromRoot} from "./shared/services.js";

const htmlFile = ".html";
const cssFile = ".css";
const jsFile = ".js";

const navbarId = "navbar-container";
const mainId = "main-container";

/**
 * Fetches content of html and returns as a html element
 * @param {string} moduleToLoad Name of folder in either components or modules and the files
 * @returns {Promise<HTMLElement>} Replacement element for container
 */
function getHTML(moduleToLoad) {
  const file = getFilePathFromRoot(moduleToLoad, htmlFile);

  return fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status} on fetch`);

      return response.text();
    })
    .then((text) => {
      const html = text.trim();
      if (!html?.startsWith("<")) throw new Error("No HTML returned on fetch");

      console.log(`Successfully loaded ${file}`);
      const fragment = document.createRange().createContextualFragment(html);
      const element = fragment.firstElementChild;
      return element;
    });
}

/**
 * Loads the CSS or JavaScript by appending link or script tag based on params
 * @param {string} moduleToLoad Name of folder in either components or modules and the files
 * @param {string} fileType {@link cssFile} or {@link jsFile}
 * @returns {Promise<void>} Resolves when asset is appended and loaded
 */
function loadAsset(moduleToLoad, fileType) {
  if (fileType !== cssFile && fileType !== jsFile)
    return reject(new Error(`Unsupported file type ${fileType}`));

  const path = getFilePathFromRoot(moduleToLoad, fileType);
  const loadingNavbar = moduleToLoad === "navbar";

  const elementId = !loadingNavbar
    ? `module-${fileType === cssFile ? "css" : "js"}`
    : null;

  return new Promise((resolve, reject) => {
    if (elementId) removeExistingAsset(elementId);

    let element;

    if (fileType === cssFile) {
      element = document.createElement("link");
      element.rel = "stylesheet";
      element.href = path;
    } else {
      element = document.createElement("script");
      element.type = "module";
      element.src = path;
    }

    if (elementId) element.id = elementId;

    element.onerror = () => {
      reject(new Error(`Failed to load ${path}`));
    };

    element.onload = () => {
      console.log(`Successfully loaded ${path}`);
      resolve();
    };

    if (fileType === cssFile) document.head.appendChild(element);
    else document.body.appendChild(element);
  });
}

/**
 * Removes element by id
 * @param {string} elementId
 */
function removeExistingAsset(elementId) {
  const existing = document.getElementById(elementId);
  if (existing) existing.remove();
}

/**
 * Replaces container element with html in component's folder and calls the loading of
 * css and js, making sure js loads after html
 * @param {string} moduleToLoad Name of folder in either components or modules and the files - default "navbar"
 */
export async function loadComponent(moduleToLoad) {
  const loadingNavbar = moduleToLoad === "navbar";

  const container = document.getElementById(loadingNavbar ? navbarId : mainId);
  if (container) container.innerHTML = "";

  await Promise.all([
    loadAsset(moduleToLoad, cssFile),
    loadAsset(moduleToLoad, jsFile),
  ]);

  const componentHTML = await getHTML(moduleToLoad);
  componentHTML.id = loadingNavbar ? navbarId : mainId;
  container.replaceWith(componentHTML);
}
