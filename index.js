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
