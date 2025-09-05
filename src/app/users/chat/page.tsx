'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaComments, 
  FaUsers, 
  FaSearch, 
  FaUser,
  FaUserTie,
  FaPlus,
  FaPaperPlane,
  FaEllipsisV,
  FaArrowLeft,
  FaBuilding,
  FaCalendarAlt,
  FaSync
} from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  activities: string[];
  isOnline: boolean;
  isAdmin?: boolean;
}

interface Message {
  id: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
  isAdmin?: boolean;
}

interface Chat {
  id: string;
  type: 'admin' | 'individual' | 'group';
  participants: User[];
  name: string;
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app this would come from API
  const mockUsers: User[] = [
    { id: 1, name: 'Badr Bouslama', email: 'bboslama@gmail.com', company: 'Sora Digital', activities: ['Exportateurs indirects'], isOnline: true },
    { id: 2, name: 'Ikram Mortabit', email: 'ikram@example.com', company: 'Tech Solutions', activities: ['Marche local'], isOnline: true },
    { id: 3, name: 'Admin Support', email: 'admin@export.com', company: 'Rencontres EXPORT', activities: ['Support'], isOnline: true, isAdmin: true },
    { id: 4, name: 'Ahmed Hassan', email: 'ahmed@example.com', company: 'Export Plus', activities: ['Exportateurs indirects', 'Marche local'], isOnline: false },
    { id: 5, name: 'Fatima Zahra', email: 'fatima@example.com', company: 'Global Trade', activities: ['Marche local'], isOnline: true },
  ];

  const mockChats: Chat[] = [
    {
      id: 'admin-chat',
      type: 'admin',
      participants: [mockUsers[2]],
      name: 'Support Admin',
      lastMessage: {
        id: '1',
        senderId: 2,
        senderName: 'Admin Support',
        content: 'Bonjour! Comment puis-je vous aider?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isAdmin: true
      },
      unreadCount: 0,
      isActive: true
    },
    {
      id: 'group-1',
      type: 'group',
      participants: [mockUsers[0], mockUsers[1], mockUsers[4]],
      name: 'Exportateurs Casablanca',
      lastMessage: {
        id: '2',
        senderId: 1,
        senderName: 'Badr Bouslama',
        content: 'Quelqu\'un a des informations sur les nouveaux documents?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isAdmin: false
      },
      unreadCount: 2,
      isActive: false
    }
  ];

  const mockMessages: { [chatId: string]: Message[] } = {
    'admin-chat': [
      {
        id: '1',
        senderId: 2,
        senderName: 'Admin Support',
        content: 'Bonjour! Comment puis-je vous aider?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isAdmin: true
      },
      {
        id: '2',
        senderId: 1,
        senderName: 'Badr Bouslama',
        content: 'Bonjour! J\'ai une question sur les documents requis pour l\'événement.',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        isAdmin: false
      },
      {
        id: '3',
        senderId: 2,
        senderName: 'Admin Support',
        content: 'Bien sûr! Pouvez-vous me préciser quel type de documents vous recherchez?',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        isAdmin: true
      }
    ],
    'group-1': [
      {
        id: '1',
        senderId: 1,
        senderName: 'Badr Bouslama',
        content: 'Bonjour à tous!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isAdmin: false
      },
      {
        id: '2',
        senderId: 5,
        senderName: 'Fatima Zahra',
        content: 'Salut! Comment ça va?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isAdmin: false
      },
      {
        id: '3',
        senderId: 1,
        senderName: 'Badr Bouslama',
        content: 'Quelqu\'un a des informations sur les nouveaux documents?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isAdmin: false
      }
    ]
  };

  useEffect(() => {
    // Load user data from session storage
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    loadChats(user.id);
  }, []);

  const loadChats = async (userId: number) => {
    try {
      const response = await fetch(`/api/chat/chats?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        const formattedChats = data.chats.map((chat: any) => ({
          id: chat.id.toString(),
          type: chat.type,
          participants: [], // Will be loaded separately
          name: chat.name,
          lastMessage: chat.last_message_content ? {
            id: chat.last_message_id?.toString() || '',
            senderId: chat.last_message_sender_id || 0,
            senderName: chat.last_message_sender || 'Unknown',
            content: chat.last_message_content,
            timestamp: new Date(chat.last_message_time),
            isAdmin: chat.last_message_is_admin || false
          } : undefined,
          unreadCount: 0,
          isActive: false
        }));
        
        setChats(formattedChats);
        
        // Set admin chat as default if available
        const adminChat = formattedChats.find((chat: Chat) => chat.type === 'admin');
        if (adminChat) {
          setCurrentChat(adminChat);
          loadMessages(adminChat.id);
        }
      } else {
        console.error('Error loading chats:', data);
        alert('Failed to load chats. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      alert('Failed to load chats. Please check your connection and refresh the page.');
    }
  };

  const loadMessages = async (chatId: string) => {
    if (isLoadingMessages) return; // Prevent multiple simultaneous requests
    
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/chat/messages?chatId=${chatId}`);
      const data = await response.json();
      
      if (response.ok) {
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isAdmin: msg.is_admin
        }));
        
        setMessages(formattedMessages);
        console.log(`Loaded ${formattedMessages.length} messages for chat ${chatId}:`, formattedMessages);
      } else {
        console.error('Error loading messages:', data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    if (!currentChat) return;

    const interval = setInterval(() => {
      loadMessages(currentChat.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const userData = sessionStorage.getItem('userData');
    if (!userData) return;

    const user = JSON.parse(userData);
    const messageContent = newMessage;
    setNewMessage('');

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: currentChat.id,
          senderId: user.id,
          content: messageContent
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newMessage: Message = {
          id: data.message.id.toString(),
          senderId: data.message.sender_id,
          senderName: data.message.sender_name,
          content: data.message.content,
          timestamp: new Date(data.message.timestamp),
          isAdmin: data.message.is_admin
        };

        // Add the new message to the local state
        setMessages(prev => [...prev, newMessage]);
        
        // Update chat's last message
        setChats(prev => prev.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, lastMessage: newMessage, unreadCount: 0 }
            : chat
        ));

        // Refresh messages from server to ensure consistency
        setTimeout(() => {
          loadMessages(currentChat.id);
        }, 500);

        // Refresh chat list to update last message in sidebar
        const userData = sessionStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          loadChats(user.id);
        }
      } else {
        const errorData = await response.json();
        console.error('Error sending message:', errorData);
        alert(`Failed to send message: ${errorData.error || 'Unknown error'}`);
        // Revert the message input if sending failed
        setNewMessage(messageContent);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
      // Revert the message input if sending failed
      setNewMessage(messageContent);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    loadMessages(chat.id);
    
    // Mark chat as active and clear unread count
    setChats(prev => prev.map(c => 
      c.id === chat.id 
        ? { ...c, isActive: true, unreadCount: 0 }
        : { ...c, isActive: false }
    ));
  };

  const [searchResults, setSearchResults] = useState<User[]>([]);

  const searchUsers = async (query: string) => {
    const userData = sessionStorage.getItem('userData');
    if (!userData) return;

    const user = JSON.parse(userData);
    
    try {
      const response = await fetch(`/api/chat/users?q=${encodeURIComponent(query)}&currentUserId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        const formattedUsers = data.users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          company: u.company,
          activities: u.activities || [],
          isOnline: u.status === 'online',
          isAdmin: false
        }));
        
        setSearchResults(formattedUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const filteredUsers = searchResults;

  const handleUserSelect = async (user: User) => {
    if (isCreatingGroup) {
      setSelectedUsers(prev => 
        prev.find(u => u.id === user.id) 
          ? prev.filter(u => u.id !== user.id)
          : [...prev, user]
      );
    } else {
      // Create individual chat
      const userData = sessionStorage.getItem('userData');
      if (!userData) return;

      const currentUser = JSON.parse(userData);
      
      try {
        const response = await fetch('/api/chat/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            type: 'individual',
            participants: [currentUser.id, user.id]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newChat: Chat = {
            id: data.chatId.toString(),
            type: 'individual',
            participants: [user],
            name: user.name,
            unreadCount: 0,
            isActive: true
          };
          
          setChats(prev => [newChat, ...prev]);
          setCurrentChat(newChat);
          setMessages([]);
          setShowUserSearch(false);
        }
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2 || !groupName.trim()) return;

    const userData = sessionStorage.getItem('userData');
    if (!userData) return;

    const currentUser = JSON.parse(userData);
    const participantIds = [currentUser.id, ...selectedUsers.map(u => u.id)];
    
    try {
      const response = await fetch('/api/chat/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          type: 'group',
          participants: participantIds
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newChat: Chat = {
          id: data.chatId.toString(),
          type: 'group',
          participants: selectedUsers,
          name: groupName,
          unreadCount: 0,
          isActive: true
        };

        setChats(prev => [newChat, ...prev]);
        setCurrentChat(newChat);
        setMessages([]);
        setSelectedUsers([]);
        setGroupName('');
        setIsCreatingGroup(false);
        setShowUserSearch(false);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <FaComments className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
                <p className="text-gray-600">Communiquez avec les autres participants</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setDebugMode(!debugMode)}
                className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span>Debug</span>
              </button>
              <button
                onClick={() => setShowUserSearch(true)}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaPlus />
                <span>Nouveau Chat</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Conversations</h3>
              <div className="space-y-2">
                {chats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentChat?.id === chat.id
                        ? 'bg-green-100 border-green-500 border'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          {chat.type === 'admin' ? (
                            <FaUserTie className="text-white text-sm" />
                          ) : chat.type === 'group' ? (
                            <FaUsers className="text-white text-sm" />
                          ) : (
                            <FaUser className="text-white text-sm" />
                          )}
                        </div>
                        {chat.participants[0]?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <div className="text-sm text-gray-500">
                            <p className="font-medium text-gray-700 truncate">
                              {chat.lastMessage.senderName}
                            </p>
                            <p className="truncate">
                              {chat.lastMessage.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg flex flex-col">
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      {currentChat.type === 'admin' ? (
                        <FaUserTie className="text-white text-sm" />
                      ) : currentChat.type === 'group' ? (
                        <FaUsers className="text-white text-sm" />
                      ) : (
                        <FaUser className="text-white text-sm" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{currentChat.name}</h3>
                      <p className="text-sm text-gray-500">
                        {currentChat.type === 'admin' ? 'Support Admin' : 
                         currentChat.type === 'group' ? `${currentChat.participants.length} participants` :
                         currentChat.participants[0]?.isOnline ? 'En ligne' : 'Hors ligne'}
                        {messages.length > 0 && ` • ${messages.length} message${messages.length > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => loadMessages(currentChat.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Actualiser les messages"
                    >
                      <FaSync />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    </div>
                  )}
                  {messages.length === 0 && !isLoadingMessages && (
                    <div className="flex justify-center py-8">
                      <div className="text-center text-gray-500">
                        <FaComments className="text-4xl mx-auto mb-2" />
                        <p>Aucun message pour le moment</p>
                      </div>
                    </div>
                  )}
                  {messages.map((message) => {
                    const userData = sessionStorage.getItem('userData');
                    const currentUser = userData ? JSON.parse(userData) : null;
                    const isOwnMessage = currentUser && message.senderId === currentUser.id;
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FaComments className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Search Modal */}
        {showUserSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isCreatingGroup ? 'Créer un groupe' : 'Nouveau chat'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowUserSearch(false);
                      setIsCreatingGroup(false);
                      setSelectedUsers([]);
                      setGroupName('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaArrowLeft />
                  </button>
                </div>

                {isCreatingGroup && (
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Nom du groupe..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                )}

                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, entreprise ou activité..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-96">
                <div className="p-4">
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUserSelect(user)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedUsers.find(u => u.id === user.id)
                            ? 'bg-green-100 border-green-500 border'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <FaUser className="text-white text-sm" />
                            </div>
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-500">{user.company}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.activities.map((activity, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  {!isCreatingGroup && (
                    <button
                      onClick={() => setIsCreatingGroup(true)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Créer un groupe
                    </button>
                  )}
                  {isCreatingGroup ? (
                    <button
                      onClick={handleCreateGroup}
                      disabled={selectedUsers.length < 2 || !groupName.trim()}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Créer le groupe ({selectedUsers.length})
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowUserSearch(false)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
                 )}

         {/* Debug Panel */}
         {debugMode && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-6 bg-gray-100 rounded-xl p-4"
           >
             <h3 className="font-semibold text-gray-900 mb-3">Debug Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
               <div>
                 <strong>Current Chat:</strong>
                 <pre className="mt-1 text-xs bg-white p-2 rounded">
                   {JSON.stringify(currentChat, null, 2)}
                 </pre>
               </div>
               <div>
                 <strong>Messages ({messages.length}):</strong>
                 <pre className="mt-1 text-xs bg-white p-2 rounded max-h-32 overflow-y-auto">
                   {JSON.stringify(messages, null, 2)}
                 </pre>
               </div>
               <div>
                 <strong>User Data:</strong>
                 <pre className="mt-1 text-xs bg-white p-2 rounded">
                   {JSON.stringify(sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')!) : 'Not logged in', null, 2)}
                 </pre>
               </div>
             </div>
           </motion.div>
         )}
       </div>
     </div>
   );
 };

export default ChatPage;
