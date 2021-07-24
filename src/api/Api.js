import axios from "axios";

const API = axios.create({
    baseURL: " https://involve.software/test_front/api",
  });

  export default API;