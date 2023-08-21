const apiUrl = 'https://opentdb.com/api.php?amount=5&category=9&type=multiple';

let currentQuestionIndex = 0;
let questions = [];
let correctAnswers = 0;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const retakeButton = document.getElementById('retake-button');
const quizCompletedElement = document.getElementById('quiz-completed');

async function fetchQuizQuestions() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        //  console.log("data", data);
        questions = data.results;
        // console.log("questions", questions);
        displayQuestion();
    } catch (error) {
        console.error(error.message);
    }
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
         // Display the question text in the HTML element with the id "question"
        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = '';
         // Combine incorrect answers with the correct answer
        const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
         // Shuffle the order of options
        allOptions.sort(() => Math.random() - 0.5);

        allOptions.forEach((option) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => checkAnswer(option, currentQuestion.correct_answer));
            optionsElement.appendChild(optionDiv);
        });
    } else {
        quizCompleted();
    }
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        correctAnswers++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

function quizCompleted() {
    questionElement.textContent = 'Quiz Completed!';
    optionsElement.innerHTML = '';
    nextButton.style.display = 'none';
    retakeButton.style.display = 'block';
    const scoreMessage = `You scored ${correctAnswers} out of ${questions.length} questions.`;
    quizCompletedElement.textContent = scoreMessage;
}

retakeButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    retakeButton.style.display = 'none';
    nextButton.style.display = 'block';
    quizCompletedElement.textContent = '';
    fetchQuizQuestions();
});

fetchQuizQuestions();