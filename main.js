let quiz_Time_Limit = 15;
let timer = null;
let currentTime = quiz_Time_Limit;



const configContainer = document.querySelector('.config-container');
const displayTime = document.querySelector('.time-duration');

let quizContainer = document.querySelector('.quiz-container');
let answerOption = document.querySelector('.answer-options');
let nextOptionBtn = document.querySelector('.next-question-btn');
let questionStatus = document.querySelector('.questions-status');
let resultContainer = document.querySelector('.result-container');

let quizCategory = 'mathematics';
let numberOfQuestion = 5;
let currentQuestions = null;
let correctlyAnswered = 0;

let useQuestion = [];

const showResult = () => {
  resultContainer.style.display = 'block';
  quizContainer.style.display = 'none';
  let innerMessage = `You Answer ${correctlyAnswered} out of ${numberOfQuestion} questions correctly. Great effort`;
  document.querySelector('.result-message').textContent = innerMessage;
}

const resetTimer = () => {
  clearInterval(timer);
  currentTime = quiz_Time_Limit;
  displayTime.textContent = `${currentTime}s`;
}

const setTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    displayTime.textContent = `${currentTime}s`;

    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrect();

      document.querySelector('.quiz-timer').style.backgroundColor = 'red';

      nextOptionBtn.style.visibility = 'visible';
      answerOption.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
    }

  }, 1000)
}
const getRandomQuestion = () => {
  const categoryQuestion = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions;
  if (useQuestion.length === Math.min(categoryQuestion.length, numberOfQuestion)) {
    return showResult();
  }

  const availableQuestion = categoryQuestion.filter((_, index) => !useQuestion.includes(index));

  const randomQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];

  useQuestion.push(categoryQuestion.indexOf(randomQuestion));

  return randomQuestion;
}



const highlightCorrect = () => {

  const correctAnswer = answerOption.querySelectorAll('.answer-option')[currentQuestions.correctAnswer];

  correctAnswer.classList.add('correct');

  const iconHtml = `<span class='material-symbols-rounded '>check_circle</span>`;
  correctAnswer.insertAdjacentHTML('beforeend', iconHtml);

}


const handleAnswer = (option, liIndex) => {

  clearInterval(timer);
  const isCorrect = currentQuestions.correctAnswer === liIndex;
  option.classList.add(isCorrect ? 'correct' : 'incorrect');


  !isCorrect ? highlightCorrect() : correctlyAnswered++;

  const iconHtml = `<span class='material-symbols-rounded '>${isCorrect ? 'check_circle' : 'cancel'}</span>`;
  option.insertAdjacentHTML('beforeend', iconHtml);


  answerOption.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
  nextOptionBtn.style.visibility = 'visible';
}

const renderQuestion = () => {
  resetTimer();
  setTimer();
  document.querySelector('.quiz-timer').style.backgroundColor = '#807F81';
  currentQuestions = getRandomQuestion();
  nextOptionBtn.style.visibility = 'hidden';
  document.querySelector('.quiz-question').textContent = currentQuestions.question;


  answerOption.innerHTML = ``;
  currentQuestions.options.forEach((option, index) => {
    const li = document.createElement('li');
    li.classList.add('answer-option');
    li.textContent = option;
    answerOption.appendChild(li);
    li.addEventListener('click', () =>
      handleAnswer(li, index));
  })

  questionStatus.innerHTML = `<b>${useQuestion.length}</b> of <b>${numberOfQuestion}</b> Questions`;
}


const startQuiz = () => {
  configContainer.style.display = 'none';
  quizContainer.style.display = 'block';

  quizCategory = document.querySelector('.category-option.active').textContent;
  numberOfQuestion = parseInt(document.querySelector('.question-option.active').textContent);

  renderQuestion();
}

const resetQuiz = () => {
  resetTimer();
  correctlyAnswered = 0;
  useQuestion.length = 0;
  configContainer.style.display = 'block';
  resultContainer.style.display = 'none';

}

document.querySelectorAll('.category-option, .question-option').forEach(option => {
  option.addEventListener('click', () => {
    option.parentNode.querySelector('.active').classList.remove('active');
    option.classList.add('active')

  })
})


renderQuestion();

nextOptionBtn.addEventListener('click', () => renderQuestion());

document.querySelector('.try-again-btn').addEventListener('click', () => resetQuiz());

document.querySelector('.start-quiz-btn').addEventListener('click', () => startQuiz())
