// NOTE:  This code below is used to create a single page application,
// an API is used from the backend server `https://salty-shore-82054.herokuapp.com/`, everytime a question is posted it or viwed it will make a request to the backend server and then show the question from the database using the api. If you tried to create a question from the "herokuapp" the new question will show app in the following page `https://mohammedbm.github.io/AwesomeAnswers-SPA/`, the opposite will work the same way well.


const DOMAIN = 'https://salty-shore-82054.herokuapp.com/';
const API_PATH = '/api/v1';
const API_KEY = 'adfc3a5a857f9c9c9bb2201bc5ee92b9366252ad91ba745b3191a6664537d7bd';

// NOTE: to keep all method that do requests to Questions togthere, we'll put them inside an object named `Question`
const Question = {
  // getAll: function () { ... }
  // ðProperty Method Shorthand. Syntax sugar for ð
  // NOTE: this method will fetch the question from the api we have and render it to the page, it will use the API_KEY to access it.
  getAll() {
    return fetch(
      `${DOMAIN}${API_PATH}/questions`, {
        headers: {
          'Authorization': API_KEY
        }
      }
    ).then(res => res.json());
  },
  // NOTE: the method will get a specific question and show it in the page
  get(id) {
    return fetch(
      `${DOMAIN}${API_PATH}/questions/${id}`, {
        headers: {
          'Authorization': API_KEY
        }
      }
    ).then(res => res.json());
  },
// NOTE: this method below will post a question to the database and update the api we have
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

//NOTE Node Selector Helpers, this is used to shorten the code and make it look cleaner
function q(query) {
  return document.querySelector(query);
}

function qs(query) {
  return document.querySelectorAll(query);
}

// NOTE:
function renderQuestions(questions = []) {
  return questions
    .map(question => `
      <div class='question-summary'>
        <a data-id=${question.id} href>${question.title}</a>
      </div>
    `)
    .join('');
}

// NOTE: this will render the selected question to the page we have.
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


// NOTE: this function will render the answers inside the question page
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
  //NOTE Write code that needs to run after the DOM is fully loaded in here
  //NOTE this code below will use the q and qs functions, now it slecet a query everytime the function is used
  const questionList = q('#question-list');
  const questionDetails = q('#question-details');
  const questionForm = q('#question-form');
  const questionNew = q('#question-new');
  const nav = q('nav');

  // NOTE: This function will render the selected question at the page and hide everything else in the page
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

// NOTE: this is the default setting for the page, it will show all the question
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

  // NOTE: this code will get the question id we need and send it to the function `showQuestion` to show the question we selected
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

// NOTE: this code will post the question we created from the form we have, without this addEventListener the question cannot be created
  questionForm.addEventListener('submit', event => {
    const {
      currentTarget
    } = event;
    event.preventDefault(); //we used `event.preventDefault();` to prevent the defailt setting when we click the button which is reloading the page every time we click.

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
