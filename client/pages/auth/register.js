import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { makeRequest, errors } = useRequest({
    url: "/api/users/register",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await makeRequest();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1> Register </h1>
        <div className="form-group">
          <label> Email: </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label> Password: </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary"> Sign up</button>
      </form>
    </div>
  );
};
