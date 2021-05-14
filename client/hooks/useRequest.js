import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const makeRequest = async (props = {}) => {
    try {
      const response = await axios[method](url, { ...body, ...props });
      setErrors(null);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops!</h4>
            <ul className="my-0">
              {error.response.data.errors.map((err) => (
                <li key={err.message}>{err.message}</li>
              ))}
            </ul>
          </div>
        );
      }
    }
  };

  return { makeRequest, errors };
};
