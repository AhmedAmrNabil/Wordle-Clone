let wordGrid = document.querySelectorAll(".letter-box");
let wordRows = document.querySelectorAll(".word-row");
let toastList = document.querySelector("#messege-list");
let currDate = new Date();
let index = Math.floor(
  (currDate.getTime() - currDate.getTimezoneOffset() * 60000) / 86400000
);
let todayWord = WORDS[12546 + (index % (WORDS.length - 12546))];
let position = 0;
let guessCount = 0;
let word = [];
let gameRunning = true;
let keyboardButtonsStyle = {};
let gridCellsStyle = [];
let animationRunning = false;
let win = false;
let correctGuesses = 0;
let winnerWords = [
  "Genius",
  "Magnificent",
  "Impressive",
  "Splendid",
  "Great",
  "Phew",
];

window.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (animationRunning) return;
  if (e.code === "Backspace") {
    deleteLetter();
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    checkWord();
    return;
  }
  if (e.code !== `Key${e.key.toUpperCase()}` || position == 5) return;
  animatePop(wordGrid[5 * guessCount + position]);
  wordGrid[5 * guessCount + position].innerText = e.key.toLowerCase();
  word.push(e.key.toLowerCase());
  position++;
});

for (let i = 0; i < 6; ++i) {
  wordGrid[i * 5 + 4].addEventListener("animationend", () => {
    animationRunning = false;
    for (const [key, value] of Object.entries(keyboardButtonsStyle)) {
      let element = document.querySelector(`button[data-key="${key}"]`);
      element.classList.add(value);
    }
    checkWin();
  });
}

function checkWin() {
  if (!gameRunning) return;
  if (guessCount == 6 || win == true) {
    gameRunning = false;
    if (win == false) {
      createMessege(todayWord.toUpperCase());
    } else {
      winAnimation();
      createMessege(winnerWords[guessCount - 1]);
    }
  }
}

function checkWord() {
  if (!gameRunning) return;
  if (word.length != 5) {
    shake();
    createToast("Not enough letters");
    return;
  }

  if (!WORDS.includes(word.join(""))) {
    shake();
    createToast("Not in word list");
    return;
  }

  let currWord = todayWord;
  let index = -1;
  animationRunning = true;

  for (let i = 0; i < word.length; ++i) {
    wordGrid[5 * guessCount + i].style.animationDelay = `${250 * i}ms`;
    if (word[i] == currWord[i]) {
      gridCellsStyle[i] = "correct-guess";
      keyboardButtonsStyle[word[i]] = "correct-letter";
      currWord = stringReplace(currWord, i, "_");
      correctGuesses++;
    }
  }

  for (let i = 0; i < word.length; ++i) {
    if (gridCellsStyle[i] == "correct-guess") continue;
    index = currWord.search(word[i]);
    if (index != -1) {
      keyboardButtonsStyle[word[i]] = "present-letter";
      gridCellsStyle[i] = "present-guess";
      currWord = stringReplace(currWord, index, "_");
    } else {
      keyboardButtonsStyle[word[i]] = "wrong-letter";
      gridCellsStyle[i] = "wrong-guess";
    }
  }

  for (let i = 0; i < 5; ++i) {
    wordGrid[5 * guessCount + i].classList.add(gridCellsStyle[i]);
  }

  if (correctGuesses == 5) {
    win = true;
  }

  correctGuesses = 0;
  guessCount++;
  position = 0;
  word = [];
  gridCellsStyle = [];
}

function animatePop(element) {
  element.animate(
    [
      { transform: "scale(0.8)", opacity: 0 },
      { transform: "scale(1.1)", opacity: 1, offset: 0.4 },
      { transform: "scale(1)", opacity: 1 },
    ],
    {
      duration: 100,
      iterations: 1,
    }
  );
}

function shake() {
  if (guessCount >= 6) return;
  wordRows[guessCount].classList.add("shake");
  wordRows[guessCount].addEventListener("animationend", () => {
    wordRows[guessCount].classList.remove("shake");
  });
}

function pressLetter(event) {
  if (position == 5 || !gameRunning) return;
  animatePop(wordGrid[5 * guessCount + position]);
  wordGrid[5 * guessCount + position].innerText = event.innerText.toLowerCase();
  word.push(event.innerText.toLowerCase());
  position++;
}

function deleteLetter() {
  if (position <= 0 || !gameRunning) return;
  position--;
  wordGrid[5 * guessCount + position].innerText = "";
  word.pop();
}

function winAnimation() {
  for (let i = 0; i < 5; ++i) {
    wordGrid[5 * (guessCount - 1) + i].style.animationDelay = `${100 * i}ms`;
    wordGrid[5 * (guessCount - 1) + i].classList.add("hard-shake");
  }
}

function createToast(messege) {
  let toast = document.createElement("li");
  toast.innerText = messege;
  toast.classList.add("alert-animation");
  toastList.insertBefore(toast, toastList.children[0]);
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}
function createMessege(messege) {
  let toast = document.createElement("li");
  toast.innerText = messege;
  toast.classList.add("alert");
  toastList.insertBefore(toast, toastList.children[0]);
}

function stringReplace(data, at, val) {
  return data.substring(0, at) + val + data.substring(at + val.length);
}
