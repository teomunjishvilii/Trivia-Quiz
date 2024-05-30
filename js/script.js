let questions = []; // Array to store fetched questions
let currentQuestionIndex = 0; // Index of the current question
let score = 0; // User's score

// Function to fetch questions from the API
async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=25&difficulty=easy&type=multiple"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    questions = data.results;
    displayQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

// Function to display the current question
function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionNumberElement = document.querySelector(".question-number");
  const questionTextElement = document.querySelector(".question-text");
  const answersListElement = document.querySelector(".answers");
  questionNumberElement.textContent = `Question ${currentQuestionIndex + 1}:`;
  questionTextElement.innerHTML = currentQuestion.question; // Use innerHTML to render HTML-encoded characters
  answersListElement.innerHTML = "";
  currentQuestion.incorrect_answers.forEach((answer) => {
    answersListElement.innerHTML += `<li><button class="answer">${answer}</button></li>`;
  });
  answersListElement.innerHTML += `<li><button class="answer correct">${currentQuestion.correct_answer}</button></li>`;
  if (currentQuestionIndex === 0) {
    document.querySelector(".prev-question").style.display = "none";
  } else {
    document.querySelector(".prev-question").style.display = "inline-block";
  }
  if (currentQuestionIndex === questions.length - 1) {
    document.querySelector(".next-question").style.display = "none";
    document.getElementById("submit-btn").style.display = "block";
  } else {
    document.querySelector(".next-question").style.display = "inline-block";
    document.getElementById("submit-btn").style.display = "none";
  }
}

// Function to handle answer selection
function handleAnswerSelection() {
  const selectedAnswer = document.querySelector(".answer.selected");
  if (!selectedAnswer) {
    alert("Please select an answer before proceeding.");
    return;
  }
  const isCorrect = selectedAnswer.classList.contains("correct");
  if (isCorrect) {
    score += 1;
  }
  currentQuestionIndex += 1;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    displayScore();
  }
}

// Event listener for the "Get started" button
document.getElementById("start-btn").addEventListener("click", () => {
  document.querySelector(".main_wrapper_content").style.display = "none";
  document.querySelector(".quiz-container").style.display = "block";
  fetchQuestions();
});

// Event listener for answer selection
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("answer")) {
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
      selectedAnswer.classList.remove("selected");
    }
    event.target.classList.add("selected");
  }
});

// Event listener for "Next Question" button
document
  .querySelector(".next-question")
  .addEventListener("click", handleAnswerSelection);

// Event listener for "Previous Question" button
document.querySelector(".prev-question").addEventListener("click", () => {
  currentQuestionIndex -= 1;
  displayQuestion();
});

// Event listener for "Submit" button
document.getElementById("submit-btn").addEventListener("click", () => {
  displayScore();
});

// Event listener for "Try Again" button
document.addEventListener("click", (event) => {
  if (event.target.id === "try-again-btn") {
    resetQuiz();
  }
});

// Function to display the user's score
function displayScore() {
  const percentageScore = ((score / questions.length) * 100).toFixed(2);
  const scoreMessage = `Your score: ${percentageScore}%`;
  const scoreContainer = document.querySelector(".score-container");
  scoreContainer.innerHTML = `<p>${scoreMessage}</p><button id="try-again-btn">Try Again</button>`;

  // Hide quiz container and main wrapper content
  document.querySelector(".quiz-container").style.display = "none";
  document.querySelector(".main_wrapper_content").style.display = "none";

  scoreContainer.style.display = "block";
}

// Event listener for "Try Again" button
document.addEventListener("click", (event) => {
  if (event.target.id === "try-again-btn") {
    resetQuiz();
  }
});

// Function to reset the quiz
function resetQuiz() {
  questions = [];
  currentQuestionIndex = 0;
  score = 0;

  // Show main wrapper content
  document.querySelector(".main_wrapper_content").style.display = "flex";

  // Hide score container
  document.querySelector(".score-container").style.display = "none";
}
