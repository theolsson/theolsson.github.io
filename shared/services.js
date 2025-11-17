/**
 * Generates the file path to a component or module
 * @param {string} moduleToLoad Name of folder in either components or modules and the files
 * @param {string} fileType File type extension (.html, .css, .js, .png, etc.)
 * @returns {string} relative path to file
 */
export function getFilePathFromRoot(moduleToLoad, fileType) {
  const componentsPath = "./components";
  const modulesPath = "./modules";

  let pathStart = moduleToLoad === "navbar" ? componentsPath : modulesPath;

  return fileType === ".png"
    ? `${pathStart}/${moduleToLoad}/icons/${moduleToLoad}${fileType}`
    : `${pathStart}/${moduleToLoad}/${moduleToLoad}${fileType}`;
}
