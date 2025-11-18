import { getElemById } from "../../shared/services.js";

let clickCounter = 0;
const storageKey = "theosWorkshop:Clicker";
const scoreElemId = "clicker-counter";

let scoreElem;

export function init() {
  clickCounter = Number(localStorage.getItem(storageKey)) || 0;
  cacheElems();
  setEventListeners();
}

function cacheElems() {
  scoreElem = getElemById(scoreElemId);
  scoreElem.textContent = clickCounter;
}

function setEventListeners() {
  const increaseBtnElem = getElemById("clicker-increase");
  increaseBtnElem.addEventListener("click", () => updateCount());
  document.addEventListener("keyup", (event) => keyUpEvent(event));

  getElemById("clicker-reset").addEventListener("click", clearCounter);
}

function keyUpEvent({ key }) {
  const k = key.toLowerCase(); 

  if (k === "delete") clearCounter();
  else if (k === "-") updateCount(-1);
  else if (k === "+" || k === "enter" || k === " ") updateCount();
  else if (!isNaN(k) && k !== " ") updateCount(Number(k));
}

function updateCount(amount = 1) {
  if (amount === 0 || isNaN(amount)) return;

  const updatedCounterAmount = clickCounter + amount;
  if (updatedCounterAmount < 0) return;

  clickCounter = updatedCounterAmount;
  localStorage.setItem(storageKey, clickCounter);

  updateCounter();
}

function clearCounter() {
  if (clickCounter === 0) return;

  clickCounter = 0;
  localStorage.removeItem(storageKey);

  updateCounter();
}

function updateCounter() {
  scoreElem.textContent = clickCounter;
}
