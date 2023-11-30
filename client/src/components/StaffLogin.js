import React, { useEffect, useState } from "react";
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

  const [data, setData] = useState(null);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const login = async () => {
    try {
      const res = await axios.post(
        constants.API_URL + "/auth/login",
        credentials,
        {
          withCredentials: true, // Include credentials (like cookies) with the request
          headers: headers,
        }
      );
      setData(res.data);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  useEffect(() => {
    if (data) {
      flags.isAdmin = data.isAdmin;
      setCurrentPageTab(
        data.isAdmin
          ? constants.PAGE_TABS.OWNER_VIEW
          : constants.PAGE_TABS.EMPLOYEE_VIEW
      );
      flags.isEmployeeSignedIn = true;
    }
  }, [data, setCurrentPageTab]);

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
