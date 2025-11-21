import { getElemById, firstLetterToUpper } from "../../shared/services.js";

const gFormId = "1FAIpQLSeLPViSqoPYxbxV1yIZuxxSHemgGHSlOjKGfnUJGqOdD_VEXg";

const gFormField = {
  typeInput: { entryId: "entry.1752159269", elemId: "form-type" },
  messageInput: { entryId: "entry.202649978", elemId: "form-message" },
  componentInput: { entryId: "entry.1758193509", elemId: "form-component" },
  nameInput: { entryId: "entry.153129400", elemId: "form-name" },
  contactInput: { entryId: "entry.220536337", elemId: "form-contact" },
};

/*
    entry.153129400 - name NEW
    entry.220536337 - cont inf NEW
    entry.1752159269 - type NEW
    entry.1758193509 - mod/comp NEW
    entry.202649978 - message NEW
    fvv - 1
    partialResponse - [null,null,"-7985215742353439545"]
    pageHistory - 0
    fbzx - -7985215742353439545
    submissionTimestamp - 1763533595352
  */

let hasPIIConsent = false;

export function init() {
  setPIIConsentListener();

  const formElem = getElemById("submitFormBtn");
  formElem.addEventListener("click", () => {
    const formData = createFormData();
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    if (!formData) throw new Error("formInit: could not create form data");

    // postToGoogleForms(formData);
  });
}

function setPIIConsentListener() {
  getElemById("form-pii-consent").addEventListener("change", function () {
    hasPIIConsent = this.checked;
    getElemById("form-name").disabled = !hasPIIConsent;
    getElemById("form-contact").disabled = !hasPIIConsent;
  });
}

function createFormData() {
  const formData = new FormData();

  formData.append(
    gFormField.typeInput.entryId,
    getCheckInputAsString(getElemById(gFormField.typeInput.elemId)) || ""
  );
  formData.append(
    gFormField.messageInput.entryId,
    getElemById(gFormField.messageInput.elemId).value || ""
  );
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
  formData.append("fvv", "1");
  const fbzxUUID = crypto.randomUUID();
  formData.append("partialResponse", [null, null, fbzxUUID]);
  formData.append("pageHistory", "0");
  formData.append("fbzx", fbzxUUID);

  return formData;
}

function postToGoogleForms(formData) {
  return;
  fetch("https://docs.google.com/forms/d/e/" + gFormId + "/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then(function () {
      console.log("✓ Submitted to Google Form (opaque response is expected)");
    })
    .catch(function (err) {
      console.error("Submission error:", err);
    });
}

export function generateCheckboxes(moduleObjArray) {
  if (!Array.isArray(moduleObjArray))
    throw new Error("generateCheckboxes: invalid modules array");

  const fieldsetElem = getElemById("form-component");

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
