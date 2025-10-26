// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { isUserLoggedIn, getUserFromLocal } from '../services/storage/storageService';
//
// const PrivateRoute = ({ children }) => {
//     const location = useLocation();
//
//     // FIXED: Call the function with ()
//     const loggedIn = isUserLoggedIn();
//
//     // Double check by getting user data
//     const userData = getUserFromLocal();
//     if (!loggedIn || !userData) {
//         return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//     }
//     console.log('refaat');
//     console.log(children);
//     // User is authenticated, render the protected component
//     return children;
// };
//
// export default PrivateRoute;