import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { movieRepository } from "../repositories/MovieRepository";
import "./MovieChatbot.css";

export default function MovieChatbot() {
    const [, setLocation] = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: "Hi! 🎬 I'm your movie assistant. Ask me about movies, genres, or tell me what you're in the mood for!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const analyzeQuery = (query) => {
        const lowerQuery = query.toLowerCase();

        // Check for specific movie search
        if (lowerQuery.includes("tell me about") ||
            lowerQuery.includes("what is") ||
            lowerQuery.includes("info about")) {
            return { type: "specific", query };
        }

        // Check for mood-based recommendations
        if (lowerQuery.includes("feel like") ||
            lowerQuery.includes("mood for") ||
            lowerQuery.includes("want to watch") ||
            lowerQuery.includes("recommend")) {
            return { type: "recommend", query };
        }

        // Check for genre queries
        const genres = ["action", "comedy", "drama", "horror", "sci-fi", "romance", "thriller", "animation"];
        for (const genre of genres) {
            if (lowerQuery.includes(genre)) {
                return { type: "genre", genre };
            }
        }

        // Default to search
        return { type: "search", query };
    };

    const searchMovies = async (query) => {
        try {
            const movies = await movieRepository.searchForMovie(encodeURIComponent(query));

            return movies.results.slice(0, 3); // Top 3 results
        } catch (error) {
            console.error("Error searching movies:", error);
            return [];
        }
    };

    const getRecommendations = async () => {
        try {
            const movies = await movieRepository.fetchPopular(1);
            return movies.slice(0, 3);
        } catch (error) {
            console.error("Error getting recommendations:", error);
            return [];
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            type: "user",
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Analyze the query
        const analysis = analyzeQuery(input);

        try {
            let movies = [];
            let responseText = "";

            if (analysis.type === "search" || analysis.type === "specific") {
                movies = await searchMovies(input);
                if (movies.length > 0) {
                    responseText = "Here's what I found:";
                } else {
                    responseText = "I couldn't find any movies matching that. Try something else!";
                }
            } else if (analysis.type === "recommend") {
                movies = await getRecommendations();
                responseText = "Based on what's popular, I recommend:";
            } else if (analysis.type === "genre") {
                movies = await searchMovies(analysis.genre);
                responseText = `Here are some great ${analysis.genre} movies:`;
            }

            setIsTyping(false);

            // Add bot response
            const botMessage = {
                type: "bot",
                text: responseText,
                movies: movies,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setIsTyping(false);
            const errorMessage = {
                type: "bot",
                text: "Oops! Something went wrong. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleMovieClick = (movieId) => {
        setLocation(`/movie/${movieId}`);
        setIsOpen(false);
    };

    const quickActions = [
        "Recommend something",
        "Action movies",
        "Romantic comedies",
        "Sci-fi thrillers"
    ];

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-avatar">🎬</div>
                        <div className="chatbot-info">
                            <h3>Movie Assistant</h3>
                            <span className="status">Online</span>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                {message.type === "bot" && (
                                    <div className="message-avatar">🤖</div>
                                )}
                                <div className="message-content">
                                    <p>{message.text}</p>

                                    {/* Movie Cards */}
                                    {message.movies && message.movies.length > 0 && (
                                        <div className="movie-suggestions">
                                            {message.movies.map((movie) => (
                                                <div
                                                    key={movie.id}
                                                    className="movie-suggestion-card"
                                                    onClick={() => handleMovieClick(movie.id)}
                                                >
                                                    {movie.poster_path && (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                            alt={movie.title}
                                                        />
                                                    )}
                                                    <div className="movie-suggestion-info">
                                                        <h4>{movie.title}</h4>
                                                        <span className="movie-rating">
                                                            ⭐ {movie.vote_average?.toFixed(1)}
                                                        </span>
                                                        <p className="movie-year">
                                                            {new Date(movie.release_date).getFullYear()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                {message.type === "user" && (
                                    <div className="message-avatar user">👤</div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message bot">
                                <div className="message-avatar">🤖</div>
                                <div className="message-content typing">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className="quick-action"
                                onClick={() => {
                                    setInput(action);
                                    setTimeout(() => handleSend(), 100);
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Ask about movies..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                        >
                            {isTyping ? <Loader size={20} className="spinning" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}