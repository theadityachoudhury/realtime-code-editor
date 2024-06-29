import { useState, useEffect, useRef } from "react";
import { useChat } from "../../context/ChatProvider";
import { useUserContext } from "../../context/UserProvider";

const UserChat = () => {
    const { messages, sendMessage } = useChat();
    const { user } = useUserContext();
    const [message, setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage({ username: `${user?.name.fname} ${user?.name.lname}`, message });
            setMessage("");
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            className="text-black min-w-72 max-w-72 h-full flex flex-col"
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage()
            }}
        >
            <div className="space-y-2">
                <p className="text-3xl text-white font-poppins font-thin">
                    Chat
                </p>
                <hr />
            </div>

            <div
                className="overflow-y-auto flex-grow p-2"
                ref={chatContainerRef}
            >
                <div className="space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`text-left text-lg text-white ${msg.username === 'YourUsername' ? 'bg-blue-700 self-message' : 'bg-gray-800 other-message'
                                } rounded-md`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">
                                    {msg.username}
                                </div>
                            </div>
                            <div className="text-md">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-2 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 rounded-md text-black"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-700 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default UserChat;
