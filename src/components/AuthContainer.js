import "./authentication.css";
import React from "react";

export default function authContainer({children}) {
    return (
        <div className={"auth-body"}>
        <div className={"auth-container"}>
            {children}
        </div>
        </div>
    );
}