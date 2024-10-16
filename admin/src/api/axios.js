import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// instance.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

instance.interceptors.response.use(response => response, error => {
  // Extract the error message
  let errorMessage = 'An error occurred';
  if (error.response) {
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.status) {
      errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    errorMessage = 'No response received from the server';
  }

  // Attach the errorMessage to the error object
  error.errorMessage = errorMessage;

  // Reject the promise so that it can be handled in the API call if needed
  return Promise.reject(error);
});

export default instance;
