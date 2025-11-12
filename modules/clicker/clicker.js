let clickCounter;
const storageKey = "theosSandbox:Clicker";
const scoreElemId = "clicker-counter";

function initClicker() {
  clickCounter = parseInt(localStorage.getItem(storageKey)) || 0;
  const counterElem = document.getElementById(scoreElemId);
  counterElem.textContent = clickCounter;
}

function increaseCount() {
  clickCounter++;
  const counterElem = document.getElementById(scoreElemId);
  localStorage.setItem(storageKey, clickCounter);
  counterElem.textContent = clickCounter;
}

function clearCounter() {
  clickCounter = 0;
  localStorage.removeItem(storageKey);
  const counterElem = document.getElementById(scoreElemId);
  counterElem.textContent = clickCounter;
}
