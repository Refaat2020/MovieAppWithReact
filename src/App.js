import React, { useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from 'wouter';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your services
import { getUserFromLocal, isUserLoggedIn } from "./services/storage/storageService";

// Import your page components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import NotificationManager from "./components/NotificationManager";
import ToastNotification from "./components/ToastNotification";
import { useUserStore } from "./store/useUserStore";
import MyMovies from "./pages/MyMovies";
import MovieChatbot from "./components/MovieChatbot";
import AppBar from "./components/AppBar";

// DEBUG: Track all location changes
const LocationTracker = () => {
    const [location] = useLocation();

    useEffect(() => {
        console.log('🔄 Location changed to:', location);
        console.log('📍 Current pathname:', window.location.pathname);
        console.log('🔐 Auth state:', {
            isLoggedIn: isUserLoggedIn(),
            hasUserData: !!getUserFromLocal()
        });
    }, [location]);

    return null;
};

// PrivateRoute component with extensive debugging
const PrivateRoute = ({ component: Component, ...rest }) => {
    const [location] = useLocation();
    const loggedIn = isUserLoggedIn();
    const userData = getUserFromLocal();

    console.log('🛡️ PrivateRoute rendered:', {
        timestamp: new Date().toISOString(),
        location,
        loggedIn,
        userData: userData ? 'EXISTS' : 'NULL',
        userDataType: typeof userData,
        userDataKeys: userData ? Object.keys(userData) : []
    });

    if (!loggedIn || !userData) {
        console.log('❌ REDIRECTING TO LOGIN from:', location);
        sessionStorage.setItem('redirectAfterLogin', location);
        return <Redirect to="/login" />;
    }

    console.log('✅ RENDERING PROTECTED COMPONENT');
    return <Component {...rest} />;
};

// Wrapper to track component renders
const RouteDebugger = ({component: Component, name }) => {
    useEffect(() => {
        console.log(`📄 ${name} component mounted`);
        return () => console.log(`📄 ${name} component unmounted`);
    }, [name]);

    return <Component />;
};

function App() {
    const [location] = useLocation();
    const initializeAuth = useUserStore(state => state.initializeAuth);

    useEffect(() => {
        console.log('🚀 App component mounted');
        console.log('📊 Initial state:', {
            location,
            pathname: window.location.pathname,
            isLoggedIn: isUserLoggedIn(),
            userData: getUserFromLocal()
        });
    }, [location]);

    useEffect(() => {
        console.log('🔄 App detected location change:', location);
    }, [location]);
    useEffect(() => {
        // Initialize auth listener on app mount
        initializeAuth();
    }, [initializeAuth]);
    return (
        <>
            <LocationTracker />
            <AppBar />
            <div className="min-h-screen bg-gray-50">
                <Switch>
                    {/* Public routes */}
                    <Route path="/login">
                        {() => {
                            console.log('🔵 Rendering Login route');
                            return <RouteDebugger component={Login} name="Login" />;
                        }}
                    </Route>

                    <Route path="/register">
                        {() => {
                            console.log('🔵 Rendering Register route');
                            return <RouteDebugger component={Register} name="Register" />;
                        }}
                    </Route>

                    {/* Private route */}
                    <Route path="/profile">
                        {() => {
                            console.log('🔵 Rendering Profile route (checking auth...)');
                            return <PrivateRoute component={Profile} />;
                        }}
                    </Route>

                    <Route path="/movie/:id">
                        {() => {
                            console.log('🔵 Rendering MovieDetails route (checking auth...)');
                            return <PrivateRoute component={MovieDetails} />;
                        }}
                    </Route>

                    <Route path="/my-movies">
                        {() => {
                            console.log('🔵 Rendering MovieDetails route (checking auth...)');
                            return <PrivateRoute component={MyMovies} />;
                        }}
                    </Route>

                    {/* Default/Home route */}
                    <Route path="/">
                        {() => {
                            console.log('🔵 Rendering Home route');
                            return <RouteDebugger component={Home} name="Home" />;
                        }}
                    </Route>

                    {/* 404 - Catch all unmatched routes */}
                    <Route>
                        {() => {
                            console.log('⚠️ 404 route triggered');
                            return (
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="text-center">
                                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                        <p className="text-gray-600 mb-4">Page not found</p>
                                        <a href="/" className="text-blue-600 hover:underline">
                                            Go back home
                                        </a>
                                    </div>
                                </div>
                            );
                        }}
                    </Route>
                </Switch>
            </div>

            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* Notification Manager */}
            <NotificationManager />

            {/* Toast Notification */}
            <ToastNotification />

            {/* TMovieChatbot */}
            <MovieChatbot />
        </>
    );
}

export default App;