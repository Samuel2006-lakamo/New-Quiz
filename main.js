//variables declaration

let quiz_Time_Limit = 15;
let timer = null;
let currentTime = quiz_Time_Limit;

console.log('hello')

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


//when quiz over display.
const showResult = () => {
//display rrsult container
  resultContainer.style.display = 'block';
  //hide quiz container
  quizContainer.style.display = 'none';
  
  
  //update the result inner message
  let innerMessage = `You Answer ${correctlyAnswered} out of ${numberOfQuestion} questions correctly. Great effort`;
  document.querySelector('.result-message').textContent = innerMessage;
}


//clears the setTimer function and call when next question active
const resetTimer = () => {
  clearInterval(timer);
  currentTime = quiz_Time_Limit;
  displayTime.textContent = `${currentTime}s`;
}


//set Timer to the function
const setTimer = () => {
  timer = setInterval(() => {
    //decrement at 1s
    currentTime--;
    displayTime.textContent = `${currentTime}s`;

//if the time is off runs
    if (currentTime <= 0) {
      
      //clear the setTimer and highlight the correct answer
      clearInterval(timer);
      
      highlightCorrect();
//change background color
      document.querySelector('.quiz-timer').style.backgroundColor = 'red';
      
//make the next button visible
      nextOptionBtn.style.visibility = 'visible';

//prevent list to be answer again
      answerOption.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
    }

  }, 1000)
}

//get random question from the question.js
const getRandomQuestion = () => {
  
  //select category to find questions
  const categoryQuestion = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions;
  
  //check if the question is complete and show result
  if (useQuestion.length === Math.min(categoryQuestion.length, numberOfQuestion)) {
    return showResult();
  }


//filter out questions already answer
  const availableQuestion = categoryQuestion.filter((_, index) => !useQuestion.includes(index));


//get random questions from available questions
  const randomQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];

//push the random question to the useQuestion
  useQuestion.push(categoryQuestion.indexOf(randomQuestion));

  return randomQuestion;
}


//when answwr wrong highlight the correct one

const highlightCorrect = () => {

  const correctAnswer = answerOption.querySelectorAll('.answer-option')[currentQuestions.correctAnswer];
//highlight correct answer
  correctAnswer.classList.add('correct');

//add the icon again
  const iconHtml = `<span class='material-symbols-rounded '>check_circle</span>`;
  correctAnswer.insertAdjacentHTML('beforeend', iconHtml);

}


//
const handleAnswer = (option, liIndex) => {

//clear the timer when lost us click
  clearInterval(timer);
  
  //check if is correct and and the correct class/incorrect
  const isCorrect = currentQuestions.correctAnswer === liIndex;
  option.classList.add(isCorrect ? 'correct' : 'incorrect');

//if is not correct can the highlightCorrect func 
//increase the correctlyAnswer var if it correct.
  !isCorrect ? highlightCorrect() : correctlyAnswered++;


//check if the answer is correct/incorrect and add the icon.
  const iconHtml = `<span class='material-symbols-rounded '>${isCorrect ? 'check_circle' : 'cancel'}</span>`;
  //insert in the option list
  option.insertAdjacentHTML('beforeend', iconHtml);

//prevert anotha list to be click after the first click
  answerOption.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
  //make the next button visible to navigate
  nextOptionBtn.style.visibility = 'visible';
}




//render the question in the quiz container
const renderQuestion = () => {
  
  //reset the time and start after any refresh
  resetTimer();
  setTimer();
  
  //redo the quiz timer background
  document.querySelector('.quiz-timer').style.backgroundColor = '#807F81';
  
  //call the ramdom questions
  currentQuestions = getRandomQuestion();
  
  //hide the next btn still you answer ;a question.
  nextOptionBtn.style.visibility = 'hidden';
  document.querySelector('.quiz-question').textContent = currentQuestions.question;

//
  answerOption.innerHTML = ``;
  
  //iterate the question option and put it in the list
  currentQuestions.options.forEach((option, index) => {
    const li = document.createElement('li');
    li.classList.add('answer-option');
    li.textContent = option;
    
    //put the lost in the html
    answerOption.appendChild(li);
    
    //addEvwntLiterner to the click button 
    //can handleAnswer function and send li and index as param
    li.addEventListener('click', () =>
      handleAnswer(li, index));
  })

//update questions status
  questionStatus.innerHTML = `<b>${useQuestion.length}</b> of <b>${numberOfQuestion}</b> Questions`;
}



//start the quiz hide the config container and start the quiz container

const startQuiz = () => {
  configContainer.style.display = 'none';
  quizContainer.style.display = 'block';


//reset the quiz category amd numberOfQuestion to the ones provided
  quizCategory = document.querySelector('.category-option.active').textContent;
  numberOfQuestion = parseInt(document.querySelector('.question-option.active').textContent);

  renderQuestion();
}


//reset the quiz after trying again
const resetQuiz = () => {
  //call the reset timer
  resetTimer();
  correctlyAnswered = 0;
  useQuestion.length = 0;
  
  //close the result comtainer and open the result container.
  configContainer.style.display = 'block';
  resultContainer.style.display = 'none';

}

//add active to the selected category, and questions category
document.querySelectorAll('.category-option, .question-option').forEach(option => {
  option.addEventListener('click', () => {
    option.parentNode.querySelector('.active').classList.remove('active');
    option.classList.add('active')

  })
})

//calling the question function
renderQuestion();


//next question btn
nextOptionBtn.addEventListener('click', () => renderQuestion());


//button to try again

document.querySelector('.try-again-btn').addEventListener('click', () => resetQuiz());


//button to start the quiz
document.querySelector('.start-quiz-btn').addEventListener('click', () => startQuiz())