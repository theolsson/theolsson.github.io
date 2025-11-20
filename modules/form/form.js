import { getElemById } from "../../shared/services.js";

const gFormId = "1FAIpQLSeLPViSqoPYxbxV1yIZuxxSHemgGHSlOjKGfnUJGqOdD_VEXg";
const gFormQuestions = [
  { id: "entry.153129400", question: "name" },
  { id: "entry.220536337", question: "contact" },
  { id: "entry.1752159269", question: "type" },
  { id: "entry.1758193509", question: "component" },
  { id: "entry.202649978", question: "message" },
];

export function init() {
  console.log("form loaded");
  setPIIConsentListener();

  const formElem = getElemById("submitFormBtn");
  formElem.addEventListener("click", () => {
    console.log("submit trigger");

    // const formData = createFormData();
    //if (!formData) throw new Error("formInit: could not create form data");

    // postToGoogleForms(formData);
  });
}

function setPIIConsentListener() {
  getElemById("consent").addEventListener("change", function () {
    const enabled = this.checked;
    getElemById("name").disabled = !enabled;
    getElemById("contact").disabled = !enabled;
  });
}

function cacheElems() {}

function createFormData() {
  var formData = new FormData();
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
}

function postToGoogleForms(formData) {
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
