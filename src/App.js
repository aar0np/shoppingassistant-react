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

// Message component 
const Message = ({ 
  message = { 
    sender: 'assistant',
    content: ''
  }, 
  isDarkMode = true 
}) => {
  const isAssistant = message?.sender === 'assistant';

  const baseStyles = `
    rounded-lg p-3 max-w-[80%]
    ${isDarkMode 
      ? isAssistant ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-700 text-zinc-200'
      : isAssistant ? 'bg-white text-zinc-800 border border-zinc-200' : 'bg-zinc-200 text-zinc-800'
    }
  `;

  const proseStyles = `
    prose ${isDarkMode ? 'prose-invert' : ''} 
    prose-zinc 
    max-w-none
    prose-headings:mb-2 prose-headings:mt-4
    prose-p:my-2
    prose-pre:bg-zinc-900 prose-pre:text-zinc-100
    prose-code:text-emerald-500
    prose-strong:text-emerald-500
    prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
    prose-li:my-0
    prose-h4:mb-4
  `;

  const formatProduct = (text) => {
    // Split text into lines and process each line
    const lines = text.split('\n');
    const products = [];
    let currentProduct = null;
    
    lines.forEach(line => {
      const imageMatch = line.match(/([a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif))/);
      if (imageMatch) {
        if (currentProduct) {
          products.push(currentProduct);
        }
        const description = line.replace(/\(Image: [^)]+\)/, '').trim();
        
        // Extract product name - look for the title before the colon
        let productName = '';
        const titleMatch = description.match(/^([^:]+):/);
        if (titleMatch) {
          productName = titleMatch[1].trim();
        } else {
          // Fallback to the first part of the description if no colon
          productName = description.split(':')[0].trim();
        }
        
        currentProduct = {
          filename: imageMatch[1],
          description: description,
          productName: productName
        };
      } else if (currentProduct && line.trim()) {
        // Append additional description lines
        currentProduct.description = currentProduct.description + ' ' + line.trim();
        products.push(currentProduct);
        currentProduct = null;
      }
    });

    if (currentProduct) {
      products.push(currentProduct);
    }

    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <div 
            key={index}
            className={`rounded-lg overflow-hidden ${
              isDarkMode ? 'bg-zinc-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center pr-4 pt-6 gap-3">
              <div className="flex-row">
                <img
                  src={`/images/${product.filename}`}
                  alt={product.productName}
                  className="w-20 h-20 rounded-md border object-cover"
                  style={{
                    width: '80px',
                    height: '80px',
                    minWidth: '80px',
                    minHeight: '80px',
                    maxWidth: '80px',
                    maxHeight: '80px'
                  }}
                />
              </div>
              <div className="flex-grow">
                <h4 className={`mb-2 ${
                  isDarkMode ? 'text-zinc-100' : 'text-zinc-800'
                } whitespace-normal`}>
                  {product.productName}
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to extract product type from content
  const getProductType = (content) => {
    if (content.toLowerCase().includes('t-shirt')) return 't-shirts';
    if (content.toLowerCase().includes('hoodie')) return 'hoodies';
    if (content.toLowerCase().includes('sweatshirt')) return 'sweatshirts';
    return 'products';
  };

  // Helper function to format introduction text
  const formatIntroText = (content) => {
    const productType = getProductType(content);
    return `Here are the ${productType} available from DataStax Apparel:`;
  };

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={baseStyles}>
        {isAssistant && (
          <Code className="inline-block mr-2 h-4 w-4 text-emerald-500" />
        )}
        <div className={isAssistant ? proseStyles : ''}>
          {message.content.includes('.png') || message.content.includes('.jpg') ? (
            // Handle product listings
            <div className="space-y-4">
              <p className={isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}>
                {formatIntroText(message.content)}
              </p>
              {formatProduct(message.content)}
            </div>
          ) : (
            // Handle regular messages
            <p className={isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}>
              {message.content}
            </p>
          )}
        </div>
      </div>
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
              <Message
                key={message.id}
                message={message}
                isDarkMode={isDarkMode}
              />
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