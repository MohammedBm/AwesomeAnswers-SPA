// NOTE: 1. Build functions to fetch our data and test our backend in the process.
// NOTE: 2. Allow CORS (cross origin resource sharing)on our backend server. We setup the `rack-cors` on awesoem answers to accomplish this.

const DOMAIN = 'http://localhost:3000';
const API_PATH = '/api/v1';
const API_KEY = 'f9d660be84e9d120ad710c919479cf5b3b449acce533ba904e326d0cdb8073b4';

// NOTE: to keep all method that do requests to Questions togthere, we'll put them inside an object named `Question`
const Question = {
  // getAll: function () { ... }
  // ð Property Method Shorthand. Syntax sugar for ð
  getAll() {
    return fetch(
      `${DOMAIN}${API_PATH}/questions`,
      {
        headers: {'Authorization':API_KEY}
      }
    )
      .then(res => res.json());
  },
  get (id){
    return fetch(
      `${DOMAIN}${API_PATH}/questions/${id}`,
      {
        headers: {'Authorization':API_KEY}
      }
    ).then(res =>res.json())
  },
  post (attributes) {
    return fetch(
      `${DOMAIN}${API_PATH}/questions/`,
      {
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
Question.getAll()
// Question.get(344)

// NOTE: Node Selector Heplers
function q (query) { return document.querySelector(query); }
function qs (query) { return document.querySelectorAll(query); }
// NOTE: View

function renderQuestions (questions = []) {
  return questions
    .map(question => `
      <div class='question-summary'>
        <a data-id = ${question.id} href>${question.title}</a>
      </div>
    `)
    .join('');
}
// NOTE: this renderQuestion function will render each question when we click on the title from the show page
function renderQuestion (question = {}) {
  const {author = {}} = question;
  return `
    <h1>${question.title}</h1>
    <p>${question.body}</p>
    <p>By <strong>${author.first_name} ${author.last_name}</strong></p>
    <button></button>
  `
}

document.addEventListener('DOMContentLoaded', event => {
  // NOTE:  write code that needs to run after the DOM is fully loaded in here
  const questionList = q('#question-list');
  const questionDetails = q('#question-details')

  // NOTE: render a single question
  // Question
  //   .get(331)
  //   .then(renderQuestion)
  //   .then(html => {
  //     questionDetails.innerHTML = html;
  //   })

  // NOTE: render all questions
  Question
    .getAll()
    .then(renderQuestions)
    .then(html => {
      questionList.innerHTML = html;
    });

    questionList.addEventListener('click', event => {
      const {target} = event;

      if(target.matches('.question-summary > a')){
        event.preventDefault();
        const id = target.getAttribute('data-id');

        Question
          .get(id)
          .then(renderQuestion)
          .then(html => {
            questionDetails.innerHTML = html
            questionDetails.classList.remove('hidden');
            questionList.classList.add('hidden')
          })


        // console.log(target.getAttribute(`data-id`));
      }
    });
});
