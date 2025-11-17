import { PNG_FILE_EXTENSION } from "./constants.js";

/**
 * Generates the file path to a component or module
 * @param {string} moduleToLoad Name of folder in either components or modules and the files
 * @param {string} fileExtension File type extension (.html, .css, .js, .png, etc.)
 * @returns {string} relative path to file
 */
export function getFilePathFromRoot(moduleToLoad, fileExtension) {
  const componentsPath = "./components";
  const modulesPath = "./modules";

  let pathStart = moduleToLoad === "navbar" ? componentsPath : modulesPath;

  return fileExtension === PNG_FILE_EXTENSION
    ? `${pathStart}/${moduleToLoad}/icons/${moduleToLoad}${fileExtension}`
    : `${pathStart}/${moduleToLoad}/${moduleToLoad}${fileExtension}`;
}

export function firstLetterToUpper(str) {
  if (typeof str !== "string")
    throw new TypeError(
      `firstLetterToUpper expects a string, got ${typeof str}`
    );

  if (str.length === 0) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
