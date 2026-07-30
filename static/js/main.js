// Elements
const landing = document.getElementById("landing-screen");
const chat = document.getElementById("chat-screen");
const btn = document.getElementById("get-started-btn");
const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
// main.js
const PREDICT_URL = "/predict/"; // <- must match your urls.py path

const CHAT_STORAGE_KEY = "chat_history";

// Show chat screen
btn.onclick = () => {
    landing.style.display = "none";
    chat.style.display = "flex";
    loadHistory();
};

function addMessage(text, cls) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message " + cls;

    // Avatar icon
    const icon = document.createElement("i");
    icon.className =
        cls === "user-message"
            ? "fas fa-user user-icon"
            : "fas fa-robot bot-icon";

    // Text
    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.innerText = text;

    // Delete icon
    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fas fa-trash delete-icon";
    deleteBtn.title = "Delete message";

    deleteBtn.onclick = () => {
        messageDiv.remove();
        saveHistory();
    };

    messageDiv.appendChild(icon);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(deleteBtn);

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    saveHistory();
}



// Typing animation
function botTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing";
    typingDiv.id = "typing-indicator";

    const icon = document.createElement("i");
    icon.className = "fas fa-robot bot-icon";

    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.innerText = "Bot is typing...";

    typingDiv.appendChild(icon);
    typingDiv.appendChild(textDiv);

    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Save and load history
function saveHistory() {
    localStorage.setItem(CHAT_STORAGE_KEY, chatContainer.innerHTML);
}
function loadHistory() {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if(saved) chatContainer.innerHTML = saved;
}

// Handle submit
chatForm.addEventListener("submit", async e => {
    e.preventDefault();
    const message = userInput.value.trim();
    if(!message) return;
    addMessage(message, "user-message");
    userInput.value = "";

    botTyping();

    try {
        const response = await fetch(PREDICT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ user_question: message })
        });
        const data = await response.json();
        document.getElementById("typing-indicator").remove();
        addMessage(data.bot, "bot-message");
    } catch(err) {
        document.getElementById("typing-indicator").remove();
        addMessage("Error: could not contact chatbot.", "bot-message");
        console.error(err);
    }
});
