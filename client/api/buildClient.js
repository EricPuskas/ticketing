import axios from "axios";

export default ({ req }) => {
  // Server
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "www.ep-ticketing-app-prod.club",
      headers: req.headers,
    });
  } else {
    // Browser
    return axios.create({
      baseURL: "/",
    });
  }
};
