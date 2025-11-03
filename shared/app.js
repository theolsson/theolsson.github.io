const componentsPath = "../components";
const modulesPath = "../modules";
const htmlFile = ".html";
const cssFile = ".css";
const jsFile = ".js";

const navbarId = "navbar-container";
const mainId = "main-container";

init();

async function init() {
  await loadComponent();
}

/**
 * Fetches content of html file in {@link filePath} and returns as a html element
 * @param {string} filePath Relative to a component file without file extension
 * @returns {Promise<HTMLElement>} Replacement element for container
 */
function getHTML(filePath) {
  const file = filePath + htmlFile;

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
 * Finds either {@link cssFile} or {@link jsFile} in {@link filePath} and appends link or script tag
 * @param {string} fileLocation Path to a component file without file extension
 * @param {string} fileType {@link cssFile} or {@link jsFile}
 * @returns {Promise<void>} Resolves when asset is appended and loaded
 */
function loadAsset(fileLocation, fileType) {
  const path = fileLocation + fileType;

  return new Promise((resolve, reject) => {
    let element;

    if (fileType !== cssFile && fileType !== jsFile)
      return reject(new Error(`Unsupported file type ${fileType}`));

    if (fileType === cssFile) {
      element = document.createElement("link");
      element.rel = "stylesheet";
      element.href = path;
    } else {
      element = document.createElement("script");
      element.src = path;
    }

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
 * Replaces container element with html in component's folder and calls the loading of
 * css and js, making sure js loads after html
 * @param {string} componentToLoad name used for component files and folders - default "navbar"
 */
async function loadComponent(componentToLoad = "navbar") {
  const loadingNavbar = componentToLoad === "navbar";
  const filePath = loadingNavbar
    ? `${componentsPath}/${componentToLoad}/${componentToLoad}`
    : `${modulesPath}/${componentToLoad}/${componentToLoad}`;

  try {
    await Promise.all([
      loadAsset(filePath, cssFile),
      loadAsset(filePath, jsFile),
    ]);

    const initFnName = `init${
      componentToLoad.charAt(0).toUpperCase() + componentToLoad.slice(1)
    }`;
    if (typeof window[initFnName] !== "function")
      throw new Error(
        `${initFnName} is not ${componentToLoad}'s init function`
      );

    const componentHTML = await getHTML(filePath);
    const container = document.getElementById(
      loadingNavbar ? navbarId : mainId
    );
    componentHTML.id = loadingNavbar ? navbarId : mainId;
    container.replaceWith(componentHTML);

    window[initFnName]();
  } catch (error) {
    console.error(`Failed to load navbar: ${error}`);
  }
}
