const componentsPath = "../components/";
const htmlFile = ".html";
const cssFile = ".css";
const jsFile = ".js";

init();

function init() {
  loadNavbar();
}

function getHTML(fileLocation) {
  const path = fileLocation + htmlFile;

  return fetch(path)
    .then((response) => {
      if (!response.ok)
        throw new Error(`${response.status} on fetch`);

      return response.text();
    })
    .then((text) => {
      const html = text.trim();
      if (html === "" || !html.startsWith("<"))
        throw new Error("No HTML returned on fetch");

      console.log(`Succesfully loaded ${path}`);
      return html;
    });
}

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
      element.defer = true;
    }

    element.onerror = () => {
      reject(new Error(`Failed to load ${path}`));
    };

    element.onload = () => {
      console.log(`Succesfully loaded ${path}`);
      resolve(path);
    };

    if (fileType === cssFile) document.head.appendChild(element);
    else document.body.appendChild(element);
  });
}

async function loadNavbar() {
  const navbarFiles = `${componentsPath}navbar/navbar`;
  const navbarId = "navbar-container";

  try {
    const [html] = await Promise.all([
      getHTML(navbarFiles),
      loadAsset(navbarFiles, cssFile),
      loadAsset(navbarFiles, jsFile),
    ]);
    document.getElementById(navbarId).innerHTML = html;
    console.log("Navbar fully loaded");
  } catch (error) {
    console.error(`Failed to load navbar: ${error}`);
  }
}
