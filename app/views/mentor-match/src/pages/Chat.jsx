import { useEffect, useState, useRef } from "react";
import { socket } from "../../../../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { getchats } from "../redux/slices/chatSlice";

export default function Chat({ isOpen, meetingId, userId }) {

    const { data: previousChats } = useSelector((state) => state.chats)
    console.log(previousChats)
    const dispatch = useDispatch()
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (meetingId && isOpen) {
            dispatch(getchats({ meetingId }))
        }
    }, [meetingId, dispatch, isOpen])

    useEffect(() => {
        socket.connect()
        socket.emit("joinGeneralChat", { userId, meetingId });

        socket.on("receiveGeneralMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receiveGeneralMessage");
        };
    }, [meetingId, userId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, previousChats]);

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

    const combinedMessages = [...(previousChats || []), ...messages];
    combinedMessages.sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt));


    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded-lg relative z-10 shadow-xl w-full max-w-2xl h-80">
                        <button
                            onClick={isOpen}
                            className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <div className="flex flex-col h-full">
                            <div ref={chatContainerRef}
                                className="flex-1 overflow-y-auto mb-4 space-y-3">
                                {combinedMessages.map((ele, index) => {
                                    const isCurrentUser = ele.userId
                                        ? ele.userId === userId
                                        : ele.sender === userId;
                                    const messageText = ele.text || ele.message;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words whitespace-normal ${isCurrentUser
                                                    ? "bg-green-500 text-white"
                                                    : "bg-blue-500 text-white"
                                                    }`}
                                            >
                                                <p>{messageText}</p>
                                                {(ele.timestamp || ele.createdAt) && (
                                                    <small className="text-xs">
                                                        {new Date(ele.timestamp || ele.createdAt).toLocaleTimeString()}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    onChange={(e) => setMessage(e.target.value)}
                                    value={message}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                                    placeholder="Type a message"
                                />
                                <button
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                    onClick={handleClick}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
