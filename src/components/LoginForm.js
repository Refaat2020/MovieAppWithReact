import "./authentication.css";
import AuthContainer from  "./AuthContainer";
import React, {useEffect, useState} from "react";
import { useLocation, Link } from 'wouter';

import useAuthStore from "../store/useAuthStore";
import {toast} from "react-toastify";



export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error, user } = useAuthStore();
    const [, setLocation] = useLocation();

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
            setLocation('/',{replace:true});
            // navigate('/', { replace: false });
        }
    }, [user, setLocation]);

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