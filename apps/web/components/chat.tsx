"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";


const faqs = [
	{
		question: "Want to book your hall?",
		answer: "we have a basic and premium package select one of them .",
		keywords: ["book", "booking", "bookkk"],
	},
	{
		question: "Who is the owner?",
		answer: "The owner of Viraj Multipurpose Hall is Narayn Patil.",
		keywords: ["owner", "narayn", "patil"],
	},
	{
		question: "hii , hello, whatapp,hii there?",
		answer: "doing good how can i help you asssit you.",
		keywords: ["hii", "hello", "whatapp", "hi", "there", "assist"],
	},
	{
		question: "What is the capacity of the hall?",
		answer: "Our hall can accommodate up to 1000 people.",
		keywords: ["capacity", "people", "accommodate", "hall", "1000"],
	},
	{
		question: "Is the price negotiable?",
		answer:
			"Yes, the price is negotiable. Please contact us at 9876543210, email virajhall@gmail.com, or use our contact form.",
		keywords: ["price", "negotiable", "cost", "rate"],
	},
	{
		question: "Where is the hall located?",
		answer:
			"Viraj Multipurpose Hall, Near 412802, Old NH4, Kini, Maharashtra 416112.",
		keywords: ["location", "address", "where", "located", "kini", "maharashtra"],
	},
	{
		question: "Is there AC in the rooms?",
		answer: "Yes, AC is available in the bride rooms.",
		keywords: ["ac", "air condition", "bride room", "cool"],
	},
	{
		question: "Is there a garden or lawn?",
		answer: "Yes, we have a garden/lawn. Check out the gallery for photos.",
		keywords: ["garden", "lawn", "outdoor", "green", "gallery"],
	},
	{
		question: "I want a refund or what is your refund policy?",
		answer:
			"Refund is guaranteed. We refund within 7 days. Check out the refund policy in the booking section or contact us.",
		keywords: ["refund", "return", "policy", "money back"],
	},
	{
		question: "Is the catering service good?",
		answer: "Yes, absolutely! Our catering service is highly rated.",
		keywords: ["catering", "food", "service", "meal"],
	},
	{
		question: "What about your plans?",
		answer: "You can look at our plans on the website for details.",
		keywords: ["plan", "package", "pricing", "offer"],
	},
	{
		question: "Manager contact?",
		answer: "Manager contact details are provided in the website footer.",
		keywords: ["manager", "contact", "phone", "footer"],
	},
	{
		question: "What about DJ?",
		answer: "DJ is optional. If you need a DJ, please contact us.",
		keywords: ["dj", "music", "sound"],
	},
	{
		question: "I want some change or have a requirement.",
		answer: "For any changes or special requirements, please contact us directly.",
		keywords: ["change", "requirement", "custom", "special"],
	},
	{
		question: "What about decoration?",
		answer:
			"If you select Premium, you get premium decor. Basic plan includes basic decor setup.",
		keywords: ["decoration", "decor", "premium", "basic"],
	},
	{
		question: "How do I contact support?",
		answer:
			"Contact us at 9876543210, email virajhall@gmail.com, or use our contact form.",
		keywords: ["support", "help", "contact", "email", "phone"],
	},
];

function findAnswer(userQuestion: string) {
	const lowerQ = userQuestion.toLowerCase();
	for (const faq of faqs) {
		if (faq.keywords && faq.keywords.some((word) => lowerQ.includes(word))) {
			return faq.answer;
		}
	}
	const faq = faqs.find((faq) =>
		faq.question.toLowerCase().includes(lowerQ)
	);
	return faq ? faq.answer : "Sorry, I couldn't find an answer to your question.";
}

const Chat: React.FC = () => {
	const [messages, setMessages] = useState<
		{ sender: string; text: string }[]
	>(	[{ sender: "bot", text: "Welcome to Viraj Multipurpose Hall! How can I assist you today?" }]
	);
	const [input, setInput] = useState("");
	const [open, setOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, open]);

	const handleSend = () => {
		if (!input.trim()) return;
		const userMessage = { sender: "user", text: input };
		const botAnswer = { sender: "bot", text: findAnswer(input) };
		setMessages([...messages, userMessage, botAnswer]);
		setInput("");
	};

	return (
		<>
			{!open && (
				<button
					onClick={() => setOpen(true)}
					className="fixed bottom-6 right-6 z-50 bg-orange-600 hover:bg-orange-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
					aria-label="Open chat"
				>
					<IoIosChatboxes className="w-7 h-7" />
				</button>
			)}

			{open && (
				<div className="fixed inset-0 z-50 flex items-end justify-end sm:items-end sm:justify-end">
					<div
						className="absolute inset-0 bg-black bg-opacity-30"
						onClick={() => setOpen(false)}
					/>
					<div className="relative w-full h-full sm:w-[400px] sm:h-[600px] sm:mr-6 sm:mb-6 bg-orange-50 border border-orange-200 rounded-none sm:rounded-lg shadow-lg flex flex-col">
						<div className="bg-orange-700 text-white px-6 py-4 sm:rounded-t-lg font-bold text-lg flex items-center gap-2">
							<FaRobot className="w-8 h-8 bg-orange-600 rounded-full p-1" />
							FAQ Chatbot
							<button
								onClick={() => setOpen(false)}
								className="ml-auto text-white hover:text-orange-200 text-2xl font-bold focus:outline-none"
								aria-label="Close chat"
							>
								×
							</button>
						</div>
						<div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-orange-100">
							{messages.map((msg, idx) => (
								<div
									key={idx}
									className={`
                    flex items-end gap-2
                    ${msg.sender === "user" ? "justify-end" : "justify-start"}
                  `}
								>
									{msg.sender === "bot" && (
										<FaRobot className="w-6 h-6 text-orange-700 mb-1" />
									)}
									<div
										className={`
                      w-fit max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow break-words whitespace-pre-line
                      ${msg.sender === "user"
												? "bg-orange-200 rounded-br-md"
												: "bg-white rounded-bl-md border border-orange-100"
											}
                    `}
									>
										{msg.text}
									</div>
									{msg.sender === "user" && (
										<FaUserCircle className="w-6 h-6 text-orange-500 mb-1" />
									)}
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>
						<div className="flex items-center px-4 py-3 bg-orange-50 sm:rounded-b-lg border-t border-orange-200">
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSend()}
								placeholder="Type a message"
								className="flex-1 px-4 py-2 rounded-full border border-orange-300 outline-none text-sm bg-white mr-2"
							/>
							<button
								onClick={handleSend}
								className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow"
								aria-label="Send"
							>
								<FaPaperPlane />
							</button>
						</div>
						<div className="text-center text-xs text-orange-700 py-2 border-t border-orange-200 bg-orange-50">
							Powered by Viraj Multipurpose Hall
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Chat;