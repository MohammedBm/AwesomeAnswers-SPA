// NOTE: 1. Build functions to fetch our data and test our backend in the process.
// NOTE: 2. Allow CORS (cross origin resource sharing)on our backend server. We setup the `rack-cors` on awesoem answers to accomplish this.

const DOMAIN = 'https://salty-shore-82054.herokuapp.com/';
const API_PATH = '/api/v1';
const API_KEY = 'adfc3a5a857f9c9c9bb2201bc5ee92b9366252ad91ba745b3191a6664537d7bd';

// NOTE: to keep all method that do requests to Questions togthere, we'll put them inside an object named `Question`

const Question = {
  // getAll: function () { ... }
  // ð Property Method Shorthand. Syntax sugar for ð
  getAll() {
    return fetch(
      `${DOMAIN}${API_PATH}/questions`, {
        headers: {
          'Authorization': API_KEY
        }
      }
    ).then(res => res.json());
  },
  get(id) {
    return fetch(
      `${DOMAIN}${API_PATH}/questions/${id}`, {
        headers: {
          'Authorization': API_KEY
        }
      }
    ).then(res => res.json());
  },
  post(attributes) {
    return fetch(
      `${DOMAIN}${API_PATH}/questions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY
        },
        body: JSON.stringify(attributes)
      }
    ).then(res => res.json());
  }
}
// usage:
/*
Question.getAll()
Question.get(400)
*/

// Node Selector Helpers
function q(query) {
  return document.querySelector(query);
}

function qs(query) {
  return document.querySelectorAll(query);
}

// View
function renderQuestions(questions = []) {
  return questions
    .map(question => `
      <div class='question-summary'>
        <a data-id=${question.id} href>${question.title}</a>
      </div>
    `)
    .join('');
}

function renderQuestion(question = {}) {
  const {
    author = {}
  } = question;
  return `
    <h1>${question.title}</h1>
    <p>${question.body}</p>
    <p><strong>Author:</strong> ${author.first_name} ${author.last_name}</p>
    <h2>Answers</h2>
    <div id="answer-list">
      ${renderAnswers(question.answers)}
    </div>
  `;
}

function renderAnswers(answers = []) {
  return answers
    .map(answer => `
      <div class="answer-summary">
        <p>${answer.body}</p>
        <p><strong>Author:</strong> ${answer.author_full_name}</p>
        <p><strong>Created At:</strong> ${answer.created_at}</p>
      </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', event => {
  // Write code that needs to run after the DOM is fully loaded in here
  const questionList = q('#question-list');
  const questionDetails = q('#question-details');
  const questionForm = q('#question-form');
  const questionNew = q('#question-new');
  const nav = q('nav');

  function showQuestion(id) {
    Question
      .get(id)
      .then(renderQuestion)
      .then(html => {
        questionDetails.innerHTML = html;
        questionDetails.classList.remove('hidden');
        questionList.classList.add('hidden');
        questionNew.classList.add('hidden');
      });
  }

  Question
    .getAll()
    .then(renderQuestions)
    .then(html => {
      questionList.innerHTML = html
    });

// NOTE: this addEventListener below will fix the navbar so we can navgeate form new question to the list quesiotns
  nav.addEventListener('click', event => {
    const {
      target
    } = event;
    event.preventDefault();
    const href = target.getAttribute('data-href');
    switch (href) {
      case 'question-list':
        questionDetails.classList.add('hidden');
        questionList.classList.remove('hidden');
        questionNew.classList.add('hidden');
        break;
      case 'question-new':
        questionDetails.classList.add('hidden');
        questionList.classList.add('hidden');
        questionNew.classList.remove('hidden');
        break;
    }
  })

  // NOTE: this code will get the question id we need
  questionList.addEventListener('click', event => {
    const {
      target
    } = event;
    if (target.matches('.question-summary > a')) {
      event.preventDefault();
      const id = target.getAttribute('data-id');
      showQuestion(id);
    }
  });

  questionForm.addEventListener('submit', event => {
    const {
      currentTarget
    } = event;
    event.preventDefault();

    const fData = new FormData(currentTarget);

    Question
      .post({
        title: fData.get('title'),
        body: fData.get('body')
      })
      .then(({
        id
      }) => showQuestion(id))
      .then(()=>{
        currentTarget.reset();
        Question
          .getAll()
          .then(renderQuestions)
          .then(html => {
            questionList.innerHTML = html
          });
      })
    // .then()
  });
});
