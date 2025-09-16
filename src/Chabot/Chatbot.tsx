import React, { useState, useRef, useEffect } from 'react';
import "./Chatbot.css";

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  avatar?: string;
}

export interface ChatbotProps {
  user: User;
  chatbotId: string;
  apiKey: string;
  position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onSaveMessage?: (messageData: { question: string; answer: string; userId: string }) => void;
  initialMessages?: ChatMessage[];
  primaryColor?: string;
  secondaryColor?: string;
  botAvatar?: string;
  userAvatar?: string;
  title?: string;
  welcomeMessage?: string;
  apiEndpoint?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  user,
  chatbotId,
  apiKey,
  position = 'center',
  onSaveMessage,
  initialMessages = [],
  primaryColor = '#6366f1',
  secondaryColor = '#f8fafc',
  botAvatar = '🤖',
  userAvatar = '👤',
  title = 'AI Assistant',
  welcomeMessage = 'How can I help you today?',
  apiEndpoint = 'https://chatbotly/api/v1/messages',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date(),
      avatar: user.avatar || userAvatar,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${apiEndpoint}?Botid=${chatbotId}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ 
          message: inputMessage.trim(), 
          userId: user.id,
          timestamp: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      const botResponse = data.answer || "Thank you for your message. How can I assist you further?";

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date(),
        avatar: botAvatar,
      };

      setMessages(prev => [...prev, botMessage]);

      if (onSaveMessage) {
        onSaveMessage({
          question: inputMessage.trim(),
          answer: botResponse,
          userId: user.id,
        });
      }

    } catch (error) {
      console.error('Chatbot API error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: 'Sorry, I encountered a temporary issue. Please try again in a moment.',
        timestamp: new Date(),
        avatar: botAvatar,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="chatbot-toggle"
        onClick={toggleChat}
        style={{ backgroundColor: primaryColor }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"/>
          </svg>
        )}
        {!isOpen && messages.length > 0 && (
          <span className="message-badge">{messages.length}</span>
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="chatbot-overlay" onClick={toggleChat}>
          <div 
            className={`chatbot-modal chatbot-${position}`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              '--primary-color': primaryColor,
              '--secondary-color': secondaryColor,
            } as React.CSSProperties}
          >
            <div className="chatbot-header">
              <div className="header-content">
                <div className="bot-avatar">{botAvatar}</div>
                <div className="header-text">
                  <h3 className="chatbot-title">{title}</h3>
                  <span className="status-text">Online • Ready to help</span>
                </div>
              </div>
              <button
                className="close-button"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.length === 0 && (
                <div className="welcome-message">
                  <div className="welcome-avatar">✨</div>
                  <div className="welcome-text">
                    <p>Hello {user.name}! 👋</p>
                    <p>{welcomeMessage}</p>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.type}`}
                >
                  <div className="message-avatar">
                    {message.avatar}
                  </div>
                  <div className="message-content">
                    <p>{message.message}</p>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message bot">
                  <div className="message-avatar">
                    {botAvatar}
                  </div>
                  <div className="message-content">
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

            <div className="chatbot-input">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="input-field"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};