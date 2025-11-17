import { getFilePathFromRoot } from "./shared/services.js";
import {
  HTML_FILE_EXTENSION,
  CSS_FILE_EXTENSION,
  JS_FILE_EXTENSION,
  NAVBAR_CONTAINER_ID,
  MAIN_CONTAINER_ID,
} from "./shared/constants.js";

/**
 * Fetches content of html and returns as a html element
 * @param {string} moduleName Name of folder in either components or modules and the files
 * @returns {Promise<HTMLElement>} Replacement element for container
 */
async function getHTML(moduleName) {
  const file = getFilePathFromRoot(moduleName, HTML_FILE_EXTENSION);

  const response = await fetch(file);
  if (!response.ok) throw new Error(`${response.status} on fetch`);

  const html = (await response.text()).trim();
  if (!html?.startsWith("<")) throw new Error("No HTML returned on fetch");

  const fragment = document.createRange().createContextualFragment(html);
  const element = fragment.firstElementChild;
  return element;
}

/**
 * Loads the CSS or JavaScript by appending link or script tag based on params
 * @param {string} moduleName Name of folder in either components or modules and the files
 * @param {string} fileExtension {@link CSS_FILE_EXTENSION} or {@link JS_FILE_EXTENSION}
 * @returns {Promise<void>} Resolves when asset is appended and loaded
 */
function loadAsset(moduleName, fileExtension) {
  if (
    fileExtension !== CSS_FILE_EXTENSION &&
    fileExtension !== JS_FILE_EXTENSION
  )
    return Promise.reject(new Error(`Unsupported file type ${fileExtension}`));

  const path = getFilePathFromRoot(moduleName, fileExtension);
  const loadingNavbar = moduleName === "navbar";

  const assetElementId = !loadingNavbar
    ? `module-${fileExtension === CSS_FILE_EXTENSION ? "css" : "js"}`
    : null;

  return new Promise((resolve, reject) => {
    if (assetElementId) removeExistingAsset(assetElementId);

    const elementToAppend = createAssetElement(path, fileExtension);

    if (assetElementId) elementToAppend.id = assetElementId;

    elementToAppend.onerror = () => {
      reject(new Error(`Failed to load ${path}`));
    };

    elementToAppend.onload = () => {
      // console.log(`Successfully loaded ${path}`); //For dev only
      resolve();
    };

    if (fileExtension === CSS_FILE_EXTENSION)
      document.head.appendChild(elementToAppend);
    else document.body.appendChild(elementToAppend);
  });
}

function createAssetElement(path, fileExtension) {
  if (fileExtension === CSS_FILE_EXTENSION) {
    const linkElem = document.createElement("link");
    linkElem.rel = "stylesheet";
    linkElem.href = path;
    return linkElem;
  } else {
    const scriptElem = document.createElement("script");
    scriptElem.type = "module";
    scriptElem.src = path;
    scriptElem.defer = true;
    return scriptElem;
  }
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
 * @param {string} moduleName Name of folder in either components or modules and the files - default "navbar"
 */
export async function loadModule(moduleName) {
  const loadingNavbar = moduleName === "navbar";

  const container = document.getElementById(
    loadingNavbar ? NAVBAR_CONTAINER_ID : MAIN_CONTAINER_ID
  );
  if (!container) throw new Error(`Container for ${moduleName} not found`);
  
  const componentHTML = await getHTML(moduleName);

  container.innerHTML = "";

  await Promise.all([
    loadAsset(moduleName, CSS_FILE_EXTENSION),
    loadAsset(moduleName, JS_FILE_EXTENSION),
  ]);

  componentHTML.id = loadingNavbar ? NAVBAR_CONTAINER_ID : MAIN_CONTAINER_ID;
  container.replaceWith(componentHTML);
}
