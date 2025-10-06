import "./authentication.css";
import AuthContainer from  "./AuthContainer";
import React, {useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import {toast} from "react-toastify";



export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error, user } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill all fields hhh");
            return;
        }

        await login(email, password);
    }

    useEffect(() => {
        if (error) toast.error(error,{
            theme: "dark",

        });
    }, [error]);

    useEffect(() => {
        if (user) {
            // toast.success("Welcome back!");
           console.log(user);
            // // ✅ Login succeeded → redirect
            // navigate("/home");
        }
    }, [user, navigate]);

    return (
        <AuthContainer>
            <div className="login-box">
                <div className="logo">Watch <span>it!</span></div>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" id="email" required onChange={(e)=>setEmail((e.target.value))}/>
                        <label htmlFor="email">Email</label>
                        <div className="highlight"></div>
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" required onChange={(e)=>setPassword(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                        <div className="highlight"></div>
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}> {loading ? "Logging in..." : "Log in"}</button>
                    <div className="extra-options">
                        <label className="remember-me">
                            <input type="checkbox"/>
                            <span>Remember me</span>
                        </label>
                    </div>
                </form>
                <div className="signup-option">
                    <span>You don't have an account?</span>
                    <Link to="/register" className="signup-link">
                        Sign Up
                    </Link>
                </div>
            </div>
        </AuthContainer>
    );
}