// storageService.js - FIXED VERSION

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

// Save user data to localStorage
export const saveUserToLocal = (userData) => {
    try {
        if (!userData) {
            console.warn('Attempted to save null/undefined user data');
            return false;
        }
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        console.log('✅ User saved to localStorage:', userData);
        return true;
    } catch (error) {
        console.error('Error saving user to localStorage:', error);
        return false;
    }
};

// Get user data from localStorage
export const getUserFromLocal = () => {
    try {
        const userStr = localStorage.getItem(USER_KEY);

        if (!userStr || userStr === 'null' || userStr === 'undefined') {
            console.log('❌ No user found in localStorage');
            return null;
        }

        const user = JSON.parse(userStr);
        console.log('✅ User retrieved from localStorage:', user);
        return user;
    } catch (error) {
        console.error('Error getting user from localStorage:', error);
        return null;
    }
};

// Remove user data from localStorage
export const removeUserFromLocal = () => {
    try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        console.log('✅ User removed from localStorage');
        return true;
    } catch (error) {
        console.error('Error removing user from localStorage:', error);
        return false;
    }
};

// Check if user is logged in - FIXED VERSION
export const isUserLoggedIn = () => {
    try {
        const user = getUserFromLocal();
        const isLoggedIn = user !== null && user !== undefined;

        console.log('🔍 isUserLoggedIn check:', {
            user,
            isLoggedIn
        });

        return isLoggedIn;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
};

// Save auth token
export const saveToken = (token) => {
    try {
        if (!token) {
            console.warn('Attempted to save null/undefined token');
            return false;
        }
        localStorage.setItem(TOKEN_KEY, token);
        console.log('✅ Token saved to localStorage');
        return true;
    } catch (error) {
        console.error('Error saving token to localStorage:', error);
        return false;
    }
};

// Get auth token
export const getToken = () => {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        return token;
    } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
    }
};

// Clear all storage
export const clearStorage = () => {
    try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ All storage cleared');
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};