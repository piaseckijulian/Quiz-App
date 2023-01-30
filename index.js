const containerDiv = document.getElementById('container');
const questionDiv = document.getElementById('question');
const categoryHeading = document.getElementById('categoryName');
const categoryDiv = document.getElementById('categorySelect');
const answersDiv = document.getElementById('answers');
const startBtn = document.getElementById('start');

const userAnswers = [];
const noQuestions = 10;

let questionNumber = 1;
let questionIndex = 0;
let correctAnswers = 0;

const getQuizData = async (category) => {
  categoryDiv.innerHTML = '';
  startBtn.style.display = 'none';

  const url = `https://opentdb.com/api.php?amount=${noQuestions}&category=${category}&type=multiple`;
  const response = await fetch(url);
  const data = await response.json();

  shuffleAnswers(data);
};

const displayCategories = async () => {
  const url = 'https://opentdb.com/api_category.php';
  const response = await fetch(url);
  const data = await response.json();

  const categorySelect = document.createElement('select');
  categorySelect.id = 'categorySelect';

  const category = document.createElement('option');
  category.innerText = 'All';
  category.value = '';
  categorySelect.appendChild(category);

  for (const categoryObject of data.trivia_categories) {
    const category = document.createElement('option');
    category.innerText = categoryObject.name;
    category.value = categoryObject.id;
    categorySelect.appendChild(category);
  }
  categoryDiv.appendChild(categorySelect);
  startBtn.onclick = () => getQuizData(categorySelect.value);
};

const shuffleAnswers = (data) => {
  const quizData = data.results;
  const incorrentAnswers = quizData[questionIndex].incorrect_answers;

  const answers = [
    incorrentAnswers[0],
    incorrentAnswers[1],
    incorrentAnswers[2],
    quizData[questionIndex].correct_answer,
  ];

  // Array Shuffle via Fisher Yates Algorithm
  for (let i = answers.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = answers[i];
    answers[i] = answers[j];
    answers[j] = k;
  }

  displayQuizData(data, answers);
};

const displayQuizData = (data, answers) => {
  const quizData = data.results;

  questionDiv.innerHTML = `${questionNumber}. ${quizData[questionIndex].question}`;

  categoryHeading.innerHTML = `${quizData[questionIndex].category}`;

  answersDiv.innerHTML = '';

  const answer1 = document.createElement('button');
  const answer2 = document.createElement('button');
  const answer3 = document.createElement('button');
  const answer4 = document.createElement('button');

  answer1.innerHTML = `A. ${answers[0]}`;
  answer2.innerHTML = `B. ${answers[1]}`;
  answer3.innerHTML = `C. ${answers[2]}`;
  answer4.innerHTML = `D. ${answers[3]}`;

  answer1.className = 'answerBtn';
  answer2.className = 'answerBtn';
  answer3.className = 'answerBtn';
  answer4.className = 'answerBtn';

  answer1.onclick = () => checkAnswer(data, answers[0]);
  answer2.onclick = () => checkAnswer(data, answers[1]);
  answer3.onclick = () => checkAnswer(data, answers[2]);
  answer4.onclick = () => checkAnswer(data, answers[3]);

  answersDiv.appendChild(answer1);
  answersDiv.appendChild(answer2);
  answersDiv.appendChild(answer3);
  answersDiv.appendChild(answer4);
};

const checkAnswer = (data, answer) => {
  const quizData = data.results;

  userAnswers.push(answer);

  if (quizData[questionIndex].correct_answer === answer) {
    correctAnswers += 1;
  }

  if (questionNumber < noQuestions) {
    questionNumber += 1;
    questionIndex += 1;
    shuffleAnswers(data);
  } else displayQuizSummary(data);
};

const displayQuizSummary = (data) => {
  const quizData = data.results;

  containerDiv.innerHTML = '';

  const score = `${correctAnswers}/${questionNumber}`;
  const percentScore = (correctAnswers / questionNumber) * 100;

  const scoreHeading = document.createElement('h3');
  scoreHeading.innerText = `Score: ${score} | ${percentScore}%`;

  containerDiv.appendChild(scoreHeading);

  questionIndex = -1;
  for (const data of quizData) {
    questionIndex += 1;

    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'summary';

    const questionP = document.createElement('p');
    questionP.innerHTML = data.question;

    const userAnswerP = document.createElement('p');
    userAnswerP.innerHTML = `Your answer: ${userAnswers[questionIndex]}`;

    const correctAnswerP = document.createElement('p');
    correctAnswerP.innerHTML = `Correct answer: ${data.correct_answer}`;

    summaryDiv.appendChild(questionP);
    summaryDiv.appendChild(userAnswerP);
    summaryDiv.appendChild(correctAnswerP);

    containerDiv.appendChild(summaryDiv);
  }
};

window.onload = () => displayCategories();
