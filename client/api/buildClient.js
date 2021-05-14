import axios from "axios";

export default ({ req }) => {
  // Server
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // Browser
    return axios.create({
      baseURL: "/",
    });
  }
};
