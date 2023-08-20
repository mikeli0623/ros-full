import React, { useState } from "react";
import "../styles/StaffLogin.scss";
import { Input } from "@chakra-ui/react";
import * as constants from "../utils/constants";
import { flags } from "utils/storage";
import Button from "components/Button";
import axios from "axios";

export default function StaffLogin({ setCurrentPageTab }) {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const [error, setError] = useState("");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    // "Content-Type": "application/json",
  };

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", credentials, { headers });
      flags.isAdmin = res.data.isAdmin;
      setCurrentPageTab(
        res.data.isAdmin
          ? constants.PAGE_TABS.OWNER_VIEW
          : constants.PAGE_TABS.EMPLOYEE_VIEW
      );
      flags.isEmployeeSignedIn = true;
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div id="staff-login-container">
      <p className="prompt">Staff Login</p>
      <div className="form">
        <div className="form_field" key="staffId">
          <label className="form_label">Staff Username</label>
          <Input
            placeholder="Enter your username here."
            className="form_text_box"
            id="username"
            onChange={handleChange}
          />
        </div>
        <div className="form_field" key="password">
          <label className="form_label">Password</label>
          <Input
            className="form_text_box"
            placeholder="Enter your password here."
            type="password"
            id="password"
            onChange={handleChange}
          />
        </div>
        <p style={{ color: "red" }}>{error}</p>
        <Button
          className="submit_button"
          colour="blue"
          content="Login"
          onClick={login}
        />
      </div>
    </div>
  );
}
