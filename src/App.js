import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
    return (
        <Router>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>

    );
}

export default App;