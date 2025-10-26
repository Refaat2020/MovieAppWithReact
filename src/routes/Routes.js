// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Profile from "../pages/Profile";
// import MovieDetails from "../pages/MovieDetails";
// import PrivateRoute from "./PrivateRoute";
//
// const AppRoutes = () => {
//     return (
//         <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/movie/:id" element={<MovieDetails />} />
//             <Route
//                 path="/profile"
//                 element={
//                     <PrivateRoute>
//                         <Profile />
//                     </PrivateRoute>
//                 }
//             />
//
//             {/* Redirect unknown routes to home (NOT login) */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//     );
// };
//
// export default AppRoutes;