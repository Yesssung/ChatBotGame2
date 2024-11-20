import React, { useState } from "react";

interface MessageInputProps {
    onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <div className="flex p-4 border-t bg-gray-100">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="메시지를 입력하세요..."
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            >
                전송
            </button>
        </div>
    );
};

export default MessageInput;
