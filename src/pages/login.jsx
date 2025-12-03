import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ UserName: "", Password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/withrights", form);
      if (res.data.success) {
        // ✅ Save user data in session storage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home", { replace: true });
 // redirect to dashboard or home page
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    }
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-5 mx-auto">
              <div className="auth-form-light text-left p-5">
                <div className="brand-logo text-center mb-3">
                  <h3 style={{ color : "#9961e8"}}>ArtNest</h3>
                </div>
                <h5>Hello! let's get started</h5>
                <h6 className="font-weight-light mb-3">Sign in to continue</h6>

                <form className="pt-3" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="UserName"
                      className="form-control form-control-lg"
                      placeholder="Username"
                      value={form.UserName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="Password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={form.Password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && <p className="text-danger text-center">{error}</p>}

                  <div className="text-center full-width mt-3">
                    <button
                      type="submit"
                      className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                    >
                      SIGN IN
                    </button>
                  </div>

                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" /> Keep me signed in
                      </label>
                    </div>
                    <a href="#" className="auth-link text-black">
                      Forgot password?
                    </a>
                  </div>
                </form>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
