const apiKey = "AIzaSyCG7f57YhdvTLkuXMWkmeAClOxZsm_0D28";
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    addMessage(userMessage, "sent");
    chatInput.value = "";

    try {
        addMessage("🤖 Typing...", "received");
        const botResponse = await getGeminiResponse(userMessage);
        document.querySelector(".message.received:last-child").remove();
        addMessage(botResponse, "received");
    } catch (error) {
        addMessage("⚠️ Error getting response. Try again!", "received");
        console.error(error);
    }
}

async function getGeminiResponse(userMessage) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{ parts: [{ text: userMessage }] }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            return formatText(data.candidates[0].content.parts[0].text);
        } else {
            return "⚠️ AI did not respond.";
        }
    } catch (error) {
        console.error(error);
        return "⚠️ API Error.";
    }
}

function formatText(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/\n/g, "<br>");
    return text;
}

function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.innerHTML = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
