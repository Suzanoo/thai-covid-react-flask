import axios from 'axios';

const API_URL = '/api/v1/covid';

const setQueryData = async (queryData) => {
  localStorage.setItem('queryData', JSON.stringify(queryData));
  return queryData;
};

const fetchCovidData = async (date) => {
  const response = await axios.post(API_URL, date, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.data) {
    return response.data;
  }
};

const dataService = {
  setQueryData,
  fetchCovidData,
};

export default dataService;
