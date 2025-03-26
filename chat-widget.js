// Sicheres Maia Chat Widget für schnitt.media mit HTML-Link Unterstützung

(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: #f4d03f;
            --chat--color-secondary: #f4d03f;
            --chat--color-background: #ffffff;
            --chat--color-font: #333333;
            font-family: sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .n8n-chat-widget .chat-messages {
            padding: 20px;
            overflow-y: auto;
            height: 80%;
            background: var(--chat--color-background);
        }

        .n8n-chat-widget .chat-message {
            padding: 10px;
            margin: 8px 0;
            border-radius: 8px;
            max-width: 80%;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .n8n-chat-widget .chat-message.user {
            background-color: var(--chat--color-primary);
            color: white;
            align-self: flex-end;
        }

        .n8n-chat-widget .chat-message.bot {
            background-color: var(--chat--color-background);
            color: var(--chat--color-font);
            align-self: flex-start;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create chat widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    document.body.appendChild(widgetContainer);

    function addMessage(content, sender = 'bot') {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;

        if (sender === 'bot') {
            messageElement.innerHTML = content;
        } else {
            messageElement.textContent = content;
        }

        document.querySelector('.chat-messages').appendChild(messageElement);
    }

    async function sendMessageToServer(message) {
        try {
            const response = await fetch(window.ChatWidgetConfig.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            addMessage(data.response || 'Sorry, ich konnte gerade nicht antworten.');
        } catch (error) {
            console.error('Fehler beim Senden der Nachricht:', error);
            addMessage('Fehler beim Verbinden mit dem Server. Bitte versuche es später erneut.');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const chatButton = document.createElement('button');
        chatButton.textContent = '💬 Chat öffnen';
        chatButton.style.position = 'fixed';
        chatButton.style.bottom = '20px';
        chatButton.style.right = '20px';
        chatButton.style.zIndex = '1000';
        document.body.appendChild(chatButton);

        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-container';
        chatWindow.innerHTML = `
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Ihre Nachricht hier..." rows="2"></textarea>
                <button>Senden</button>
            </div>
        `;
        widgetContainer.appendChild(chatWindow);

        chatButton.addEventListener('click', () => {
            chatWindow.style.display = 'block';
        });

        const sendButton = chatWindow.querySelector('button');
        const textarea = chatWindow.querySelector('textarea');

        sendButton.addEventListener('click', () => {
            const message = textarea.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            textarea.value = '';

            sendMessageToServer(message);
        });
    });
})();
