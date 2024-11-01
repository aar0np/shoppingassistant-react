import React, { useState, useEffect, useRef } from 'react';
import { Send, Moon, Sun, Code } from 'lucide-react';

const DataStaxLogo = ({ isDarkMode }) => {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
      isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'
    }`}>
      <svg 
        viewBox="0 0 30 13" 
        className={`w-5 h-5 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
      >
        <path
          fill="currentColor"
          d="M10.886.864H0v12.272h10.886l2.734-2.122V2.986L10.886.864ZM2.11 2.986h9.4v8.03h-9.4v-8.03ZM29.284 3.075V1h-9.953l-2.703 2.075v2.85L19.331 8h8.674v2.924H17.167V13h10.22l2.703-2.076V8l-2.702-2.075h-8.675v-2.85h10.571Z"
        />
      </svg>
    </div>
  );
};

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello, what DataStax Astra, Langflow, or Cassandra gear can I help you find?",
      sender: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        content: input.trim(),
        sender: 'user'
      };
      setMessages([...messages, newMessage]);
      setInput('');
      
      // Process message to Langflow
      setIsTyping(true);
      await processMessageToLangflow([...messages, newMessage], input.trim());
    }
  };

  async function processMessageToLangflow(chatMessages, chatMessage) {
    let langflowMessage = { 
      input_value: chatMessage, 
      output_type: "chat", 
      input_type: "chat"
    };
    
    try {
      const response = await fetch(process.env.REACT_APP_LANGFLOW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(langflowMessage)
      });
      
      const data = await response.json();
      setMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          content: data.outputs[0].outputs[0].results.message.data.text,
          sender: 'assistant'
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-4 ${
      isDarkMode 
        ? 'bg-zinc-950 text-zinc-100' 
        : 'bg-zinc-100 text-zinc-900'
    }`}>
      <div className={`w-full max-w-2xl h-[600px] flex flex-col rounded-lg overflow-hidden ${
        isDarkMode
          ? 'bg-zinc-900 border-zinc-800'
          : 'bg-white border-zinc-200'
      } border`}>
      
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-3">
            <DataStaxLogo isDarkMode={isDarkMode} />
            <div>
              <h2 className={`text-lg font-semibold ${
                isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
              }`}>DataStax Apparel Assistant</h2>
              <p className="text-sm text-emerald-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className={`h-4 w-4 ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`} />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-11 h-6 rounded-full relative ${
                isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <Moon className={`h-4 w-4 ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`} />
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-grow overflow-auto p-4 ${
          isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'
        }`} ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? isDarkMode 
                        ? 'bg-zinc-700 text-zinc-200'
                        : 'bg-zinc-200 text-zinc-800'
                      : isDarkMode
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-white text-zinc-800 border border-zinc-200'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <Code className="inline-block mr-2 h-4 w-4 text-emerald-500" />
                  )}
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`rounded-lg p-3 max-w-[80%] ${
                  isDarkMode
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-white text-zinc-800 border border-zinc-200'
                }`}>
                  <Code className="inline-block mr-2 h-4 w-4 text-emerald-500" />
                  Checking stock availability...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={`flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 placeholder-zinc-500'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder-zinc-500'
              } border`}
            />
           <button
              type="submit"
              className="p-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-zinc-100"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;