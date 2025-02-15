import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Chat({ isOpen, meetingId, userId }) {

    const SOCKET_URL = "http://localhost:4000";

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])

    const socket = io(SOCKET_URL, {
        autoConnect: false,
    });

    //for message
    useEffect(() => {
        socket.connect()
        socket.emit("joinGeneralChat", { userId: userId, meetingId });

        socket.on("receiveGeneralMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receiveGeneralMessage");
        };
    }, []);

    const handleClick = () => {
        const newMessage = {
            text: message,
            userId,
            meetingId,
        }
        socket.emit('sendGeneralMessage', { message: newMessage })
        console.log(newMessage)
        setMessage('')
    }
    console.log(messages)

    return (

        <div>
            {isOpen && (
                <div>
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>

                        <div className="bg-white p-6 rounded-lg relative z-10 shadow-xl w-96 h-80">
                            <button
                                onClick={isOpen}
                                className="absolute top-2 right-3 text-gray-600 hover:text-gray-800">
                                ✖
                            </button>
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                                    <div className="flex justify-start">
                                        <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                                            <p>Hello, how can I help you today?</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-green-500 text-white p-2 rounded-lg max-w-xs">
                                            <p>hi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        onChange={(e) => { setMessage(e.target.value) }}
                                        value={message}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                                        placeholder="Type a message"
                                    />
                                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        onClick={handleClick}>
                                        send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
