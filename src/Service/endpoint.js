
const API_URL = "https://fictus.10hourlabs.com/talents";

const getAll = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  }
  catch (e) {
    console.log(e)
  }
};
  

  export default {
    getAll
  };