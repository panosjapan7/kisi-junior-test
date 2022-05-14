import { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./SignInPage.module.css";
import client from "./client";

export default function SignInPage({ setLoginSecret }) {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post("/logins", {
        user: { domain, email, password },
        login: { type: "device" }
      });
      client.setLoginSecret(res.secret);
      // console.log("res: ",res)
      setLoginSecret(res.secret)
      navigate("/groups");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div>
      <h3 className="mt-4 mb-4">Sign In for Kisi Test Task</h3>
      <form className={css.form} onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="formEmail" className="form-label">
            Organization Domain
          </label>
          <input
            id="formEmail"
            className="form-control"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formEmail" className="form-label">
            Email address
          </label>
          <input
            id="formEmail"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="formPassword" className="form-label">
            Password
          </label>
          <input
            id="formPassword"
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="mb-3">
            <div className="alert alert-danger" role="alert">
              Incorrect email or password!
            </div>
          </div>
        )}
        <div className="mb-3">
          <button className="btn btn-primary">Sign In</button>
        </div>
      </form>
    </div>
  );
}
