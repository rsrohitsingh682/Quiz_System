const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
var scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://quizinternapi.herokuapp.com/questions";

fetch(proxyurl + url)
.then(res => {
    return res.json();
})
.then(loadedQuestions => {
    console.log(loadedQuestions);
    questions = loadedQuestions;

    startGame();
})
.catch(()=> {
    console.log("Can’t access " + url + " response. Blocked by browser?");
});


const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 8;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

   if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      // go to the end page
      localStorage.setItem("mostRecentScore", score);
      return window.location.assign("end.html");
   }

    questionCounter++;
    progressText.innerText = `Question${questionCounter}/${MAX_QUESTIONS}`;

    //update the progress bar

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex,1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        var classToApply = 'incorrect' ;
        if (selectedAnswer == currentQuestion.answer){
            classToApply = 'correct';
        }
        
        if (classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

