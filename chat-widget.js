// Custom Chat Widget Script for schnitt.media (Optimiert für GitHub Hosting)

(function() {
    document.addEventListener("DOMContentLoaded", function() {
        const chatWidgetContainer = document.createElement("div");
        chatWidgetContainer.id = "chat-widget-container";
        document.body.appendChild(chatWidgetContainer);

        chatWidgetContainer.innerHTML = `
            <div class="chat-widget">
                <button id="chat-toggle">💬</button>
                <div id="chat-window" class="hidden">
                    <div class="chat-header">
                        <span>Maia - Dein Assistent</span>
                        <button id="close-chat">✖</button>
                    </div>
                    <div id="chat-content"></div>
                    <input type="text" id="chat-input" placeholder="Frage eingeben...">
                    <button id="send-message">Senden</button>
                </div>
            </div>
        `;

        // Event-Listener für das Chat-Widget
        document.getElementById("chat-toggle").addEventListener("click", function() {
            document.getElementById("chat-window").classList.toggle("hidden");
        });

        document.getElementById("close-chat").addEventListener("click", function() {
            document.getElementById("chat-window").classList.add("hidden");
        });

        document.getElementById("send-message").addEventListener("click", function() {
            const message = document.getElementById("chat-input").value;
            if (message.trim() !== "") {
                document.getElementById("chat-content").innerHTML += `<p><strong>Du:</strong> ${message}</p>`;
                document.getElementById("chat-input").value = "";
                sendMessageToMaia(message);
            }
        });

        async function sendMessageToMaia(message) {
            try {
                const response = await fetch("https://schnitt.app.n8n.cloud/webhook/785e0c0c-12e5-4249-9abe-47bb131975cb/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "sendMessage", chatInput: message })
                });
                const data = await response.json();
                if (data.output) {
                    document.getElementById("chat-content").innerHTML += `<p><strong>Maia:</strong> ${data.output}</p>`;
                } else {
                    document.getElementById("chat-content").innerHTML += `<p><strong>Maia:</strong> Sorry, ich konnte gerade nicht antworten. Bitte versuche es später erneut.</p>`;
                }
            } catch (error) {
                console.error("Fehler beim Senden:", error);
                document.getElementById("chat-content").innerHTML += `<p><strong>Fehler:</strong> Verbindung zum Server fehlgeschlagen.</p>`;
            }
        }
    });
})();
