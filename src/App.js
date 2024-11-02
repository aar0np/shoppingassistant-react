import React, { useState } from 'react';
import { Code, Moon, Sun, Send } from 'lucide-react';

const Message = ({ message, isDarkMode }) => {
  const isAssistant = message.sender === 'assistant';

  const baseStyles = `
    rounded-lg p-3 max-w-[80%] ${
      isAssistant
        ? isDarkMode 
          ? 'bg-zinc-800 text-zinc-300'
          : 'bg-white text-zinc-800 border border-zinc-200'
        : isDarkMode
          ? 'bg-zinc-700 text-zinc-200'
          : 'bg-zinc-200 text-zinc-800'
    }
  `;

  const proseStyles = `
    prose ${isDarkMode ? 'prose-invert' : ''} 
    prose-zinc 
    max-w-none
    prose-p:my-2
    prose-p:font-normal
  `;

  const formatParagraph = (text) => {
    if (text.includes('DataStax') && !text.includes('following') && !text.includes('Hello')) {
      const [itemName, ...rest] = text.split('\n');
      return (
        <>
          <p className="font-semibold">{itemName}</p>
          {rest.map((line, i) => (
            <p key={i} className="text-sm">{line}</p>
          ))}
        </>
      );
    }
    return <p>{text}</p>;
  };

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div>
        <div className={baseStyles}>
          {isAssistant && (
            <Code className="inline-block mr-2 h-4 w-4 text-emerald-500" />
          )}
          <div className={isAssistant ? proseStyles : ''}>
            {message.content.split('\n\n').map((paragraph, index) => (
              <React.Fragment key={index}>
                {paragraph.trim() && formatParagraph(paragraph)}
                {!paragraph.trim() && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Preview = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const sampleMessages = [
    {
      id: 1,
      sender: 'assistant',
      content: "Hello! I'd be happy to help you find DataStax apparel. What kind of items are you looking for?"
    },
    {
      id: 2,
      sender: 'user',
      content: "Show me your hoodies"
    },
    {
      id: 3,
      sender: 'assistant',
      content: "Here are the following DataStax hoodies available:\n\nDataStax Black Hoodie\nPremium cotton blend, available in Extra Large (DSH916XL), Large (DSH916L), Medium (DSH916M)\n\nDataStax Vintage 2015 MVP Hoodie\nLimited edition commemorative design, available in Extra Large (DSH915XL)"
    },
    {
      id: 4,
      sender: 'user',
      content: "What other clothing do you have?"
    },
    {
      id: 5,
      sender: 'assistant',
      content: "We have several other items available:\n\nDataStax Developer Day T-Shirt\nComfortable 100% cotton with the DataStax logo on front and Developer Day design on back. Available in S, M, L, XL\n\nDataStax Apache Cassandra Polo\nPremium breathable fabric with embroidered logo. Available in Black (DSP101) and Navy (DSP102)\n\nDataStax Conference Jacket\nLightweight water-resistant shell with logo patch. Available in unisex sizes S-XXL"
    }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-4 ${
      isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
    }`}>
      <div className={`w-full max-w-2xl h-[600px] flex flex-col rounded-lg overflow-hidden ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      } border`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'
            }`}>
              <svg viewBox="0 0 30 13" className={`w-5 h-5 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                <path
                  fill="currentColor"
                  d="M10.886.864H0v12.272h10.886l2.734-2.122V2.986L10.886.864ZM2.11 2.986h9.4v8.03h-9.4v-8.03ZM29.284 3.075V1h-9.953l-2.703 2.075v2.85L19.331 8h8.674v2.924H17.167V13h10.22l2.703-2.076V8l-2.702-2.075h-8.675v-2.85h10.571Z"
                />
              </svg>
            </div>
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
        }`}>
          <div className="space-y-4">
            {sampleMessages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className={`flex-grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 placeholder-zinc-500'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder-zinc-500'
              } border`}
            />
            <button
              className="p-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-zinc-100"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;