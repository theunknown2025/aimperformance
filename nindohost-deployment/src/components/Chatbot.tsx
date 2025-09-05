'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant virtuel pour les Rencontres Régionales EXPORT. Comment puis-je vous aider ?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
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
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.',
        isUser: false,
        timestamp: new Date()
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
                         className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[416px] h-[499px] mb-6 overflow-hidden"
          >
                         {/* Header */}
             <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-6 flex items-center justify-between relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white rounded-full"></div>
                 <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
                 <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full"></div>
               </div>
               
               <div className="flex items-center space-x-3 relative z-10">
                 <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                   <FaRobot className="text-2xl" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Assistant EXPORT</h3>
                   <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                     <p className="text-sm opacity-90">En ligne</p>
                   </div>
                 </div>
               </div>
               
               <button
                 onClick={() => setIsOpen(false)}
                 className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
               >
                 <FiX className="text-xl" />
               </button>
             </div>

                         {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[320px] bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                                     <div
                     className={`max-w-[280px] px-4 py-3 rounded-2xl shadow-sm ${
                       message.isUser
                         ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                         : 'bg-white text-gray-800 border border-gray-200'
                     }`}
                   >
                     <p className="text-sm leading-relaxed">{message.text}</p>
                     <p className={`text-xs mt-2 ${
                       message.isUser ? 'opacity-80' : 'text-gray-500'
                     }`}>
                       {message.timestamp.toLocaleTimeString('fr-FR', {
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                     </p>
                   </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                                   <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl shadow-sm">
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                     <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     <span className="text-xs text-gray-500 ml-2">Assistant en train d'écrire...</span>
                   </div>
                 </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

                         {/* Input */}
             <div className="border-t border-gray-200 p-6 bg-white">
               <div className="flex space-x-3">
                 <input
                   ref={inputRef}
                   type="text"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Tapez votre message..."
                   className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white text-gray-900 hover:bg-gray-50 transition-colors"
                   disabled={isLoading}
                 />
                 <button
                   onClick={handleSendMessage}
                   disabled={!inputValue.trim() || isLoading}
                   className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                 >
                   <FiSend className="text-lg" />
                 </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

             {/* Chat Button */}
       <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setIsOpen(!isOpen)}
         className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
       >
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
           <div className="absolute top-2 right-2 w-3 h-3 border border-white rounded-full"></div>
           <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full"></div>
         </div>
         
         <FaRobot className="text-3xl relative z-10" />
         
         {/* Pulse Animation */}
         <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
       </motion.button>
    </div>
  );
};

export default Chatbot;
