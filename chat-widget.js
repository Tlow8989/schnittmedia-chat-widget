// Sicheres Chat Widget für schnitt.media mit HTML-Link Unterstützung

(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #f4d03f);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #f4d03f);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Poppins', sans-serif;
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
            font-family: inherit;
        }

        .n8n-chat-widget .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: var(--chat--color-primary);
            color: white;
            align-self: flex-end;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: var(--chat--color-font);
            align-self: flex-start;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    document.body.appendChild(widgetContainer);

    async function sendMessage(message) {
        const response = await fetch(window.ChatWidgetConfig.webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        return response.json();
    }

    function addMessage(text, sender = 'bot', isHTML = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        if (isHTML) {
            messageElement.innerHTML = text;
        } else {
            messageElement.textContent = text;
        }
        document.querySelector('.chat-messages').appendChild(messageElement);
    }

    async function handleUserMessage() {
        const message = document.querySelector('textarea').value.trim();
        if (!message) return;
        addMessage(message, 'user');
        document.querySelector('textarea').value = '';

        try {
            const data = await sendMessage(message);
            addMessage(data.response, 'bot', true);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong. Please try again later.');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const chatToggle = document.createElement('button');
        chatToggle.textContent = 'Chat öffnen';
        chatToggle.onclick = () => {
            document.querySelector('.chat-container').style.display = 'block';
        };
        widgetContainer.appendChild(chatToggle);

        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-interface">
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <textarea rows="2" placeholder="Ihre Nachricht hier..."></textarea>
                    <button type="button">Senden</button>
                </div>
            </div>
        `;
        widgetContainer.appendChild(chatContainer);

        chatContainer.querySelector('button').addEventListener('click', handleUserMessage);
    });
})();
