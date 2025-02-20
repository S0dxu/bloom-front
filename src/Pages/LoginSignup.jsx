import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [state, setState] = useState("Login");
    const [hidden, setHidden] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [isChecked, setIsChecked] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const validateUsername = (username) => {
        if (username !== username.trim()) {
            return false;
        } else return true;
    }

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            state === "Login" ? login() : signup();
        }
    };

    const login = async () => {
        if (!validateEmail(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
    
        let responseData;
        await fetch("https://ah873hdsha98h2wuisah9872.onrender.com/login", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData = data);
    
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.href = "/";
        } else {
            setErrorMessage(responseData.errors || "An error occurred during login.");
        }
    };
    
    const signup = async () => {
        if (!validateUsername(formData.username)) {
            setErrorMessage("Username cannot contain spaces.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
    
        if (!isChecked) {
            setErrorMessage("You must agree to the Terms and Conditions to sign up.");
            return;
        }
    
        let responseData;
        await fetch("https://ah873hdsha98h2wuisah9872.onrender.com/signup", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                name: formData.username
            }),
        }).then((response) => response.json()).then((data) => responseData = data);
    
        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.href = "/";
        } else {
            setErrorMessage(responseData.errors || "An error occurred during signup.");
        }
    };    

    const switchState = (newState) => {
        setState(newState);
        setErrorMessage("");
    };

    return (
        <div className='loginsignup' onKeyDown={handleKeyDown}>
            <div className="loginsignup-cnt">
                {state === "Sign Up" ? (
                    <h1>Create an account</h1>
                ) : (
                    <h1>We are happy to see you again</h1>
                )}
                <div className="loginsignup-fields">
                    <div className="field-container">
                    {state === "Sign Up" ? (
                        <div>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={changeHandler}
                                type="text"
                                placeholder=" "
                            />
                            <label>Username*</label>
                        </div>
                    ) : (
                        <></>
                    )}
                    </div>
                    <div className="field-container">
                        <input
                            name="email"
                            value={formData.email}
                            onChange={changeHandler}
                            type="email"
                            placeholder=" "
                        />
                        <label>Email*</label>
                    </div>
                    <div className="field-container">
                        <input
                            name="password"
                            value={formData.password}
                            onChange={changeHandler}
                            type={hidden ? "text" : "password"}
                            placeholder=" "
                            maxLength={30}
                        />
                        <label>Password*</label>
                        {hidden ? <svg onClick={() => setHidden(false)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> : <svg onClick={() => setHidden(true)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>}
                    </div>
                </div>
                {state === "Sign Up" && (
                    <div className="login-signup-agree">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <p>I agree to the Terms and Conditions</p>
                    </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button onClick={() => { state === "Login" ? login() : signup(); }}>
                    Continue
                </button>
                {state === "Sign Up" ? (
                    <p className='loinsignup-login'>
                        Already have an account? <span onClick={() => { switchState("Login"); }}>Login here</span>
                    </p>
                ) : (
                    <p className='loinsignup-login'>
                        Create an account? <span onClick={() => { switchState("Sign Up"); }}>Click here</span>
                    </p>
                )}

                {/* <div className="or">
                    <hr />
                    <p>or</p>
                    <hr />
                </div>
                <a className="use-google"><img src="https://static.cdnlogo.com/logos/g/23/goolge-icon.png" />{state} with Google</a>
                <a className="use-google"><img src="https://th.bing.com/th/id/R.3d6a2ad56bc3403c5cfcc3efe09b741b?rik=7w0mZmIMOAqbkQ&pid=ImgRaw&r=0" />{state} with Microsoft</a>
                <a className="use-google"><img src="https://th.bing.com/th/id/R.66dacd13d1a786cad40e9197159da06a?rik=6q8PoTr4wsCZCg&pid=ImgRaw&r=0" />{state} with Apple</a> */}
            </div>
        </div>
    );
};

export default LoginSignup;
