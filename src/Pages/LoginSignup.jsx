import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [state, setState] = useState("Login");
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
        await fetch("https://ah873hdsha98h2wuisah9872-nw0e.onrender.com/login", {
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
        if (!validateEmail(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
    
        if (!isChecked) {
            setErrorMessage("You must agree to the Terms and Conditions to sign up.");
            return;
        }
    
        let responseData;
        await fetch("https://ah873hdsha98h2wuisah9872-nw0e.onrender.com/signup", {
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
                            type="password"
                            placeholder=" "
                        />
                        <label>Password*</label>
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

                <div className="or">
                    <hr />
                    <p>or</p>
                    <hr />
                </div>
                <a className="use-google"><img src="https://static.cdnlogo.com/logos/g/23/goolge-icon.png" />{state} with Google</a>
                <a className="use-google"><img src="https://th.bing.com/th/id/R.3d6a2ad56bc3403c5cfcc3efe09b741b?rik=7w0mZmIMOAqbkQ&pid=ImgRaw&r=0" />{state} with Microsoft</a>
                <a className="use-google"><img src="https://th.bing.com/th/id/R.66dacd13d1a786cad40e9197159da06a?rik=6q8PoTr4wsCZCg&pid=ImgRaw&r=0" />{state} with Apple</a>
            </div>
        </div>
    );
};

export default LoginSignup;
