import { useState } from 'react'
import astraApparelLogo from './astra_apparel_border_sm.png'
import './App.css'
import './components/UI/avatar.tsx'
import DevShoppingAssistant from './components/UI/dev-shopping-assistant.tsx'
import './lib/utils.ts'
import {base,components, utilities} from './tailwind.config.js'
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
		<div classname="App">
			<div style={{ position: "relative", height: "600px", width: "700px"}}>
				<img src={astraApparelLogo} height="100" />
				<MainContainer>
					<ChatContainer>
						<MessageList
							scrollBehavior='smooth'
							typingIndicator={isTyping ? <TypingIndicator content="The Astra Apparel assistant is typing..." /> : null}
						>
							{messages.map((message, mIndex) => {
								return <Message key={mIndex} model={message} />
							})}
						</MessageList>
						<MessageInput placeholder='Type message here' onSend={handleSend} />
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	)
}

export default App