import React, { useState, useRef, useEffect } from 'react';
import "./Chatbot.css";

export interface User {
  id: string;
  name: string;
  image?: string;
}

export interface ConversationEntry {
  user: string;
  bot: string;
  time: Date;
}

export interface ChatbotProps {
  user: User;
  chatbotId: string;
  apiKey: string;
  conversation: ConversationEntry[];
  setConversation: React.Dispatch<React.SetStateAction<ConversationEntry[]>>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  secondaryColor?: string;
  welcomeMessage?: string;
  apiEndpoint?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  user,
  chatbotId,
  apiKey,
  conversation,
  setConversation,
  position = 'bottom-right',
  primaryColor = '#2563eb',
  secondaryColor = '#ffffff',
  welcomeMessage = 'How can I help you today?',
  apiEndpoint = 'https://chatbotly/api/v1/messages',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
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
          message: userMessage, 
          userId: user.id,
          timestamp: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

      const data = await res.json();
      const botResponse = data.answer || "Thank you for your message. How can I assist you further?";

      // Add the new conversation entry to the state
      const newEntry: ConversationEntry = {
        user: userMessage,
        bot: botResponse,
        time: new Date()
      };

      setConversation(prev => [...prev, newEntry]);

    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Add error entry to conversation
      const errorEntry: ConversationEntry = {
        user: userMessage,
        bot: 'Sorry, I encountered a temporary issue. Please try again in a moment.',
        time: new Date()
      };

      setConversation(prev => [...prev, errorEntry]);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chatbot-toggle chatbot-${position}`}
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
        {!isOpen && conversation.length > 0 && (
          <span className="message-badge">{conversation.length}</span>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className={`chatbot-modal chatbot-${position}`}>
          <div className="chatbot-header">
            <div className="header-content">
              <div className="user-info">
                <div className="user-avatar">💬</div>
                <div className="user-details">
                  <h3 className="user-name">Chat Assistant</h3>
                  <span className="user-status">Online now</span>
                </div>
              </div>
            </div>
            <button
              className="close-button"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {conversation.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-content">
                  <p className="welcome-text">Hello {user.name}! 👋</p>
                  <p className="welcome-subtext">{welcomeMessage}</p>
                </div>
              </div>
            )}
            
            {conversation.map((entry, index) => (
              <React.Fragment key={index}>
                {/* User Message - Right side */}
                <div className="message user">
                  <div className="message-content">
                    <p>{entry.user}</p>
                    <span className="message-time-small">{formatTime(entry.time)}</span>
                  </div>
                </div>

                {/* Bot Message - Left side */}
                <div className="message bot">
                  <div className="message-content">
                    <p>{entry.bot}</p>
                    <span className="message-time-small">{formatTime(new Date(entry.time.getTime() + 1000))}</span>
                  </div>
                </div>

                {/* Date separator for new days */}
                {(index === 0 || formatDate(entry.time) !== formatDate(conversation[index - 1].time)) && (
                  <div className="date-separator">
                    <span>{formatDate(entry.time)}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {/* Loading indicator for bot response */}
            {isLoading && (
              <div className="message bot">
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
              placeholder="Type a message..."
              disabled={isLoading}
              className="input-field"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
              style={{ backgroundColor: primaryColor }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};