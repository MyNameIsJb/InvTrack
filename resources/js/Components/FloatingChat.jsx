import { useState, useEffect, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";

export default function FloatingChat() {
    const { auth, initialMessages } = usePage().props; // Pinagsama ko na ang destructuring
    const [isOpen, setIsOpen] = useState(false);

    // FIX: Ginawang default value ang initialMessages para may history agad
    const [messages, setMessages] = useState(initialMessages || []);

    const scrollRef = useRef(null);

    // 1. Listen sa Real-time Events
    useEffect(() => {
        const channel = window.Echo.channel("chat-room");

        channel.listen("MessageSent", (e) => {
            setMessages((prev) => [...prev, e.message]);
        });

        return () => window.Echo.leave("chat-room");
    }, []);

    // 2. Auto-scroll logic - Mas pinaganda ang timing
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const { data, setData, post, processing, reset } = useForm({
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();
        if (!data.message.trim() || processing) return;

        // 1. Gawa tayo ng temporary message object
        const newMessage = {
            id: Date.now(), // temporary ID
            message: data.message,
            user_id: auth.user.id,
            user: auth.user, // para lumabas ang name mo
            created_at: new Date().toISOString(),
        };

        // 2. I-push agad sa UI (Optimistic Update)
        setMessages((prev) => [...prev, newMessage]);

        // 3. I-clear agad ang input box para mukhang mabilis
        const currentMessage = data.message;
        reset("message");

        // 4. Saka natin ipadala sa server
        post("/messages", {
            data: { message: currentMessage },
            onSuccess: () => {
                // Optional: Pwede mong linisin ang state dito kung kailangan
            },
            onError: () => {
                // Kung nag-fail, tanggalin ang huling message o mag-alert
                alert("Failed to send message");
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-85 h-[450px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out">
                    {/* Header - Mas hawig sa Messenger */}
                    <div className="bg-white border-b p-3 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                GC
                            </div>
                            <span className="font-bold text-gray-800">
                                Global Chat
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:bg-gray-100 rounded-full p-1 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Message Body */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-3 overflow-y-auto space-y-3 bg-white text-sm"
                    >
                        {messages.length === 0 && (
                            <p className="text-center text-gray-400 mt-10">
                                No messages yet. Start the conversation!
                            </p>
                        )}
                        {messages.map((msg, index) => {
                            const isMe = msg.user_id === auth.user.id;

                            const time = new Date(
                                msg.created_at,
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                >
                                    {/* Header: Name at Time */}
                                    <div
                                        className={`flex gap-2 items-baseline mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <span className="text-[10px] font-bold text-gray-600">
                                            {isMe ? "You" : msg.user?.name}
                                        </span>
                                        <span className="text-[9px] text-gray-400">
                                            {time}
                                        </span>
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={`px-4 py-2 rounded-2xl max-w-[85%] break-words shadow-sm ${
                                            isMe
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-gray-100 text-gray-800 rounded-tl-none"
                                        }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer/Input */}
                    <form
                        onSubmit={submit}
                        className="p-3 border-t bg-white flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                            disabled={processing || !data.message.trim()}
                            className={`p-2 rounded-full transition-colors ${
                                !data.message.trim()
                                    ? "text-gray-300"
                                    : "text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    isOpen ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        {/* Red Dot Notification - Opsyonal */}
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-blue-600"></span>
                    </div>
                )}
            </button>
        </div>
    );
}
