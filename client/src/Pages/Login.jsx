import React, { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import styles from './Login.module.css';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [isRegistrationPending, setIsRegistrationPending] = useState(false); // To track registration state

  const [loginEmailOrUsername, setLoginEmailOrUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [file, setFile] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect');

  useEffect(() => {
    localStorage.clear("token");
  }, []);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const isEmail = loginEmailOrUsername.includes('@');
    const body = isEmail
      ? { email: loginEmailOrUsername, password: loginPassword }
      : { username: loginEmailOrUsername, password: loginPassword };

    try {
      const res = await axios.post("/auth/login", body);
      localStorage.setItem("token", res.data.token);
      // Removed redirection
      toast.success(`${res.data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistrationPending(true);
    setIsLogin(false);
    setIsFileUpload(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', registerEmail);
      formData.append('password', registerPassword);
      formData.append('name', registerName);
      formData.append('username', registerUsername);

      try {
        await axios.post("/auth/register", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success("Registration completed successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        // Removed redirection
      } catch (error) {
        toast.error("Failed to upload file or complete registration.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } else {
      toast.error("Please select a file first.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className={styles.loginFlipContainer}>
      <div className={`${styles.loginFlipCard} ${isLogin ? styles.loginFlipLogin : isFileUpload ? styles.loginFlipFileUpload : styles.loginFlipRegister}`}>
        <div className={styles.loginFlipCardInner}>
          <div className={styles.loginFlipCardFront}>
            <div className={styles.loginForm}>
              <h2>Login</h2>
              <form>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={loginEmailOrUsername}
                  onChange={(e) => setLoginEmailOrUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button type="submit" onClick={handleLogin}>Login</button>
              </form>
              <button className={styles.loginSwitchButton} onClick={handleSwitch}>Switch to Register</button>
            </div>
          </div>
          <div className={styles.loginFlipCardBack}>
            <div className={styles.loginForm}>
              <h2>Register</h2>
              <form>
                <input
                  type="text"
                  placeholder="Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button type="submit" onClick={handleRegister}>Register</button>
              </form>
              <button className={styles.loginSwitchButton} onClick={handleSwitch}>Switch to Login</button>
            </div>
          </div>
          {isFileUpload && (
            <div className={styles.loginFlipCardFileUpload}>
              <div className={styles.loginForm}>
                <h2>Upload ID Proof</h2>
                <p>Please upload an image file for ID proof.</p>
                <form>
                  <input
                    type="file"
                    accept="image/*" // Restrict file types to images only
                    onChange={handleFileChange}
                  />
                  <button type="submit" onClick={handleFileUpload}>Upload File</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
