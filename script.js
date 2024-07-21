let wordGrid = document.querySelectorAll(".letter-box");
let wordRows = document.querySelectorAll(".word-row");
let toastList = document.querySelector("#messege-list");
let date = Date.now();
let todayWord =
  WORDS[12546 + (Math.floor(date / 8.64e7) % (WORDS.length - 12546))];
let position = 0;
let row = 0;
let word = [];
let gameRunning = true;
let changingKeyboardLetters = {};
let changingWordLetters = {};
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
  e.preventDefault();
  if (e.code === "Backspace") {
    deleteLetter();
    return;
  } else if (e.key === "Enter") {
    checkWord();
    return;
  } else if (e.code !== `Key${e.key.toUpperCase()}` || position == 5) return;
  animatePop(wordGrid[5 * row + position]);
  wordGrid[5 * row + position].innerText = e.key.toLowerCase();
  word.push(e.key.toLowerCase());
  position++;
});

for (let i = 0; i < 6; ++i) {
  wordGrid[i * 5 + 4].addEventListener("animationend", () => {
    animationRunning = false;
    for (const [key, value] of Object.entries(changingKeyboardLetters)) {
      let element = document.querySelector(`button[data-key="${key}"]`);
      element.classList.add(value);
    }
    if (!gameRunning) return;
    if (row == 6) {
      gameRunning = false;
      if (win == false) {
        let toast = document.createElement("li");
        toast.innerText = todayWord;
        toast.classList.add("alert");
        toastList.insertBefore(toast, toastList.children[0]);
      } else {
        winAnimation();
        let toast = document.createElement("li");
        toast.innerText = winnerWords[row - 1];
        toast.classList.add("alert");
        toastList.insertBefore(toast, toastList.children[0]);
      }
    } else if (win == true) {
      winAnimation();
      gameRunning = false;
      let toast = document.createElement("li");
      toast.innerText = winnerWords[row - 1];
      toast.classList.add("alert");
      toastList.insertBefore(toast, toastList.children[0]);
    }
  });
}

function createAlert(messege) {
  let toast = document.createElement("li");
  toast.innerText = messege;
  toast.classList.add("alert-animation");
  toastList.insertBefore(toast, toastList.children[0]);
  toast.addEventListener("animationend", () => {
    toast.remove();
  });
}

function checkWord() {
  if (word.length != 5) {
    shake();
    createAlert("Not enough letters");
    return;
  }
  if (!WORDS.includes(word.join(""))) {
    shake();
    createAlert("Not in word list");
    return;
  }

  let currWord = todayWord;
  let index = -1;
  animationRunning = true;

  for (let i = 0; i < word.length; ++i) {
    wordGrid[5 * row + i].style.animationDelay = `${250 * i}ms`;
    if (word[i] == currWord[i]) {
      changingWordLetters[5 * row + i] = "correct-guess";
      changingKeyboardLetters[word[i]] = "correct-letter";
      currWord = currWord.substring(0, i) + "_" + currWord.substring(i + 1);
      correctGuesses++;
    }
  }

  for (let i = 0; i < word.length; ++i) {
    index = currWord.search(word[i]);
    if (changingWordLetters[5 * row + i] == "correct-guess") continue;
    if (index != -1) {
      changingKeyboardLetters[word[i]] = "present-letter";
      changingWordLetters[5 * row + i] = "present-guess";
      currWord =
        currWord.substring(0, index) + "_" + currWord.substring(index + 1);
    } else {
      changingKeyboardLetters[word[i]] = "wrong-letter";
      changingWordLetters[5 * row + i] = "wrong-guess";
    }
  }

  for (const [key, value] of Object.entries(changingWordLetters)) {
    wordGrid[key].classList.add(value);
  }

  if (correctGuesses == 5) {
    win = true;
  }
  correctGuesses = 0;
  row++;
  position = 0;
  word = [];
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
  if (row >= 6) return;
  wordRows[row].classList.add("shake");
  wordRows[row].addEventListener("animationend", () => {
    wordRows[row].classList.remove("shake");
  });
}

function pressLetter(event) {
  if (position == 5) return;
  animatePop(wordGrid[5 * row + position]);
  wordGrid[5 * row + position].innerText = event.innerText.toLowerCase();
  word.push(event.innerText.toLowerCase());
  position++;
}

function deleteLetter() {
  if (position > 0) {
    position--;
    wordGrid[5 * row + position].innerText = "";
    word.pop();
    console.log(word.join(""));
  }
}

function winAnimation() {
  for (let i = 0; i < 5; ++i) {
    wordGrid[5 * (row - 1) + i].style.animationDelay = `${100 * i}ms`;
    wordGrid[5 * (row - 1) + i].classList.add("hard-shake");
  }
}
