import "./authentication.css";
import AuthContainer from  "./AuthContainer";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore"
import {toast} from "react-toastify";


export default function RegisterForm() {
    const [email,setEmail] = useState("");
    const [fullName,setFullName] = useState("");
    const [password,setPassword] = useState("");
    const [passwordConformation,setPasswordConformation] = useState("");
    const {register,loading,error} = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password || !passwordConformation) {
            toast.error("Please fill in all fields", { theme: "dark" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address", { theme: "dark" });
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", { theme: "dark" });
            return;
        }
        if (password !== passwordConformation) {
            toast.error("Passwords do not match", { theme: "dark" });
            return;
        }
        console.log(fullName);
        await register(email, password,fullName);

        if (error) {
            toast.error(error, { theme: "dark" });
        } else {
            toast.success("Account created successfully!", { theme: "dark" });
            // navigate("/");
        }
    };

    return (
        <AuthContainer>
            <div className="login-box">
                <div className="logo">Watch <span>it!</span></div>
                <form id="signupForm" onSubmit={handleSubmit} >
                    <div className="input-group">
                        <input type="text" id="name" required onChange={(e)=>setFullName(e.target.value)} value={fullName}/>
                        <label htmlFor="name">Full Name</label>
                        <div className="highlight"></div>
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" required onChange={(value)=>setEmail(value.target.value)} value={email}/>
                        <label htmlFor="email">Email</label>
                        <div className="highlight"></div>
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" required onChange={(value)=>setPassword(value.target.value)} value={password}/>
                        <label htmlFor="password">Password</label>
                        <div className="highlight"></div>
                    </div>
                    <div className="input-group">
                        <input type="password" id="confirmPassword" required onChange={(value)=>setPasswordConformation(value.target.value)} value={passwordConformation}/>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="highlight"></div>
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
                </form>
                <div className="signup-option">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </AuthContainer>
    );
}