import React, { useEffect, useRef, useState } from 'react'
import '../CSS/contentSection.css'
import { assets } from '../assets/assets'
import { suggestions } from '../assets/suggestions'
import { askGemini } from '../gemini'

const ContentSection = () => {
    const cardImages = [assets.compass_icon, assets.bulb_icon, assets.message_icon, assets.code_icon]
    const [randomSuggestions, setRandomSuggestions] = useState([])
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([]); // {role: 'user'|'gemini'|'error', text: string}
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const shuffled = suggestions.sort(() => 0.5 - Math.random())
        setRandomSuggestions(shuffled.slice(0, 4))
    }, [])

    useEffect(() => {
        // Auto-scroll to latest message
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = async () => {
        const input = userInput.trim();
        if (!input || loading) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setUserInput("");
        setLoading(true);
        try {
            const res = await askGemini(input);
            setMessages(prev => [...prev, { role: 'gemini', text: res }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'error', text: "Error fetching response. Please try again." }]);
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
            </div>
            <div className="main-container">
                <div className="greet">
                    <p><span>Hey there!</span></p>
                    <p>What’s on your mind today?</p>
                </div>
                <div className="cards">
                    {
                        randomSuggestions.map((text, index) => (
                                <div className="card" key={index}>
                                    <p>{text}</p>
                                    <img src={cardImages[index]} alt="" />
                                </div>
                            )
                        )
                    }
                </div>
                <div className="chat-section" style={{ maxHeight: 300, overflowY: 'auto', margin: '16px 0', padding: '8px', background: '#f7f7fa', borderRadius: 8 }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-bubble ${msg.role}`}
                            style={{
                                textAlign: msg.role === 'user' ? 'right' : 'left',
                                margin: '8px 0',
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    background: msg.role === 'user' ? '#d1e7ff' : msg.role === 'gemini' ? '#fff' : '#ffe0e0',
                                    color: '#222',
                                    borderRadius: 16,
                                    padding: '8px 16px',
                                    maxWidth: '80%',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {msg.text}
                            </span>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-bubble gemini" style={{ textAlign: 'left', margin: '8px 0' }}>
                            <span style={{
                                display: 'inline-block',
                                background: '#fff',
                                color: '#222',
                                borderRadius: 16,
                                padding: '8px 16px',
                                maxWidth: '80%',
                            }}>
                                <span className="dot-flashing" style={{ fontSize: 18 }}>Thinking…</span>
                            </span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder='Ask Gemini'
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img
                                src={assets.send_icon}
                                alt=""
                                style={{ cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
                                onClick={handleSend}
                            />
                        </div>
                    </div>
                    <p className='bottom-info'>
                        Gemini can make mistakes, so double-check its responses. Check important info.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ContentSection