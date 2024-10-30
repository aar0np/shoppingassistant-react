import { useState, useEffect, useRef, scrollAreaRef, input, setInput } from 'react'
import astraApparelLogo from './astra_apparel_border_sm.png'
import './App.css'
import './index.css'
import './components/UI/avatar.tsx'
import DevShoppingAssistant from './components/UI/dev-shopping-assistant.tsx'
import './lib/utils.ts'
import {base,components, utilities} from './tailwind.config.js'
import { Avatar, AvatarFallback, AvatarImage} from "src/components/UI/avatar.tsx"
import { Card, CardHeader, CardContent, CardFooter } from "src/components/UI/card.tsx"
import { Button} from "src/components/UI/button.tsx"
import { Input } from "src/components/UI/input.tsx"
import { ScrollArea } from "src/components/UI/scroll-area.tsx"
import { Switch } from "src/components/UI/switch.tsx"
import { Sun, Moon, Code, Send } from "lucide-react"


import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"
 
function App() {
	const [messages, setMessages] = useState([
		{
			message: "Hello, I am the Astra Apparel shopping assistant. How can I help you?",
			sender: "AstraAssistant",
			direction: "incoming"
		}
	]);
	const [isTyping, setIsTyping] = useState(false);
	
	// added from dev-shopping-assistant.tsx
	const [isDarkMode, setIsDarkMode] = useState(true);


	// send message
	const handleSend = async (message) => {
		const newMessage = {
			message: message,
			sender: "user",
			direction: "outgoing"
		}

		const newMessages = [...messages, newMessage];

		// update messages state
		setMessages(newMessages);

		// process message to Langflow
		setIsTyping(true);
		await processMessageToLangflow(newMessages, message);
	};

	async function processMessageToLangflow(chatMessages,chatMessage) {
			// chatMessages { send: "user" or "ChatGPT", message: "message" }
			// Langflow request object
			// { input_value: "message", output_type: "chat", input_type: "chat" }

		let langflowMessage = { input_value: chatMessage, output_type: "chat", input_type: "chat"};
		console.log("LANGFLOW_URL=" + process.env.REACT_APP_LANGFLOW_URL)
		await fetch(process.env.REACT_APP_LANGFLOW_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(langflowMessage)
		}).then((data) => {
			return data.json();
		}).then((data) => {
			// console.log(data.outputs[0].outputs[0].results.message.data.text);
			setMessages(
				[...chatMessages, {
					message: data.outputs[0].outputs[0].results.message.data.text,
					sender: "AstraAssistant",
					direction: "incoming"
				}]
			);
			setIsTyping(false);
		});
	}
	return (
		<div className="App" className={isDarkMode ? 'dark' : ''}>
			<Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-zinc-900 text-zinc-300 border-zinc-800">
				<CardHeader className="flex flex-row items-center justify-between p-4 border-b border-zinc-800">
				<div className="flex items-center gap-3">
					<Avatar>
					<AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
					<AvatarFallback>AI</AvatarFallback>
					</Avatar>
					<div>
					<h2 className="text-lg font-semibold text-zinc-100">Dev Shopping Assistant</h2>
					<p className="text-sm text-emerald-400">Online</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Sun className="h-4 w-4 text-zinc-400" />
					<Switch
					checked={isDarkMode}
					onCheckedChange={setIsDarkMode}
					className="data-[state=checked]:bg-zinc-700"
					aria-label="Toggle dark mode"
					/>
					<Moon className="h-4 w-4 text-zinc-400" />
				</div>
				</CardHeader>
				<CardContent className="flex-grow overflow-hidden p-4" ref={scrollAreaRef}>
				<ScrollArea className="h-full pr-4">
					{messages.map((message) => (
					<div
						key={message.id}
						className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
						className={`rounded-lg p-3 max-w-[80%] ${
							message.sender === 'user'
							? 'bg-zinc-700 text-zinc-200'
							: 'bg-zinc-800 text-zinc-300'
						}`}
						>
						{message.sender === 'assistant' && (
							<Code className="inline-block mr-2 h-4 w-4 text-emerald-400" />
						)}
						{message.content}
						</div>
					</div>
					))}
				</ScrollArea>
				</CardContent>
				<CardFooter className="p-4 border-t border-zinc-800">
				<form
					onSubmit={(e) => {
					e.preventDefault()
					handleSend()
					}}
					className="flex w-full items-center space-x-2"
				>
					<Input
					type="text"
					placeholder="Type your message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-grow bg-zinc-800 border-zinc-700 text-zinc-300 placeholder-zinc-500 focus:ring-emerald-500 focus:border-emerald-500"
					/>
					<Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-zinc-100">
					<Send className="h-4 w-4" />
					<span className="sr-only">Send</span>
					</Button>
				</form>
				</CardFooter>
			</Card>
			</div>
	)
}

export default App