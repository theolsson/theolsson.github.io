const devMode = true; // True interrupts submit and logs the formData

import { getElemById, firstLetterToUpper } from "../../shared/services.js";

const gFormId = "1FAIpQLSeLPViSqoPYxbxV1yIZuxxSHemgGHSlOjKGfnUJGqOdD_VEXg";

const gFormField = {
  typeInput: { entryId: "entry.1752159269", elemId: "form-type" },
  messageInput: { entryId: "entry.202649978", elemId: "form-message" },
  componentInput: { entryId: "entry.1758193509", elemId: "form-component" },
  nameInput: { entryId: "entry.153129400", elemId: "form-name" },
  contactInput: { entryId: "entry.220536337", elemId: "form-contact" },
};

const piiConsentId = "form-pii-consent";
const submitBtnId = "submit-form-btn";
const formId = "custom-message-form";

let hasPIIConsent = false;

export function init() {
  setPIIConsentListener();
  setSubmitEventListener();
}

function setPIIConsentListener() {
  const consentElem = getElemById(piiConsentId);
  const nameElem = getElemById(gFormField.nameInput.elemId);
  const contactElem = getElemById(gFormField.contactInput.elemId);

  consentElem.addEventListener("change", function () {
    hasPIIConsent = this.checked;

    if (hasPIIConsent) {
      nameElem.disabled = false;
      contactElem.disabled = false;
    } else {
      nameElem.value = "";
      nameElem.disabled = true;
      contactElem.value = "";
      contactElem.disabled = true;
    }
  });
}

function setSubmitEventListener() {
  const formElem = getElemById(submitBtnId);
  formElem.addEventListener("click", () => {
    const messageInput = getElemById(gFormField.messageInput.elemId).value;

    if (!messageInput || messageInput === "")
      return console.warn("message empty");

    const formData = createFormData(messageInput);
    if (!formData) throw new Error("formInit: could not create form data");

    postToGoogleForms(formData);

    const consentElem = getElemById(piiConsentId);
    consentElem.checked = false;
    consentElem.dispatchEvent(new Event("change"));
  });
}

function createFormData(messageInput) {
  const formData = new FormData();

  formData.append(
    gFormField.typeInput.entryId,
    getCheckInputAsString(getElemById(gFormField.typeInput.elemId)) ||
      "General fallback"
  );
  formData.append(gFormField.messageInput.entryId, messageInput);
  formData.append(
    gFormField.componentInput.entryId,
    getCheckInputAsString(getElemById(gFormField.componentInput.elemId)) || ""
  );
  if (hasPIIConsent) {
    formData.append(
      gFormField.nameInput.entryId,
      getElemById(gFormField.nameInput.elemId).value || ""
    );
    formData.append(
      gFormField.contactInput.entryId,
      getElemById(gFormField.contactInput.elemId).value || ""
    );
  } else {
    formData.append(gFormField.nameInput.entryId, "");
    formData.append(gFormField.contactInput.entryId, "");
  }
  return formData;
}

function postToGoogleForms(formData) {
  if (devMode) {
    console.log("submit guard through devMode = true");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    getElemById(formId).reset();
    return;
  }
  fetch("https://docs.google.com/forms/d/e/" + gFormId + "/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then(function () {
      console.log("✓ Submitted to Google Form (opaque response is expected)");
      getElemById(formId).reset();
    })
    .catch(function (err) {
      console.error("Submission error:", err);
    });
}

export function generateCheckboxes(moduleObjArray) {
  if (!Array.isArray(moduleObjArray))
    throw new Error("generateCheckboxes: invalid modules array");

  const fieldsetElem = getElemById(gFormField.componentInput.elemId);

  // Destructure to access only the property needed locally
  moduleObjArray.forEach(({ name }) => {
    const labelElem = document.createElement("label");
    const inputElem = document.createElement("input");
    inputElem.type = "checkbox";
    inputElem.name = "component";
    inputElem.value = name;
    labelElem.appendChild(inputElem);
    labelElem.appendChild(
      document.createTextNode(` ${firstLetterToUpper(name)}`)
    );
    fieldsetElem.appendChild(labelElem);
  });
}

function getCheckInputAsString(elem) {
  let returnString = "";
  let checkingFirst = true;

  const labelElems = elem.querySelectorAll("label");

  for (let i = 0; i < labelElems.length; i++) {
    const inputElem = labelElems[i].querySelector("input");
    if (!inputElem) continue;

    if (inputElem.type === "radio" && inputElem.checked) {
      returnString = inputElem.value;
      break;
    } else if (inputElem.type === "checkbox" && inputElem.checked) {
      if (!checkingFirst) returnString += ", ";
      checkingFirst = false;

      returnString += inputElem.value;
    }
  }

  return returnString;
}
