import { useEffect, useState } from "react";

export default function Chat({ auth }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Makinig sa broadcast ng Laravel
        window.Echo.channel("chat-room").listen("MessageSent", (e) => {
            setMessages((prev) => [...prev, e.message]);
        });

        // Clean up kapag inalis ang component
        return () => window.Echo.leave("chat-room");
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        // I-send sa controller via axios o Inertia post
        await axios.post("/messages", { message: newMessage });
        setNewMessage("");
    };

    return (
        <div>
            {/* Display Messages */}
            <div className="h-64 overflow-y-auto">
                {messages.map((m, i) => (
                    <p key={i}>
                        <strong>{m.user.name}:</strong> {m.message}
                    </p>
                ))}
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage}>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
