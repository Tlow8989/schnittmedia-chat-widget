// Custom Chatbot Widget (Inspired by original n8n-chatbot-template)
// Self-hosted and customizable version

(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
    script.onload = function() {
        initChatbot();
    };
    document.head.appendChild(script);

    function initChatbot() {
        const chatbotDiv = document.createElement('div');
        chatbotDiv.id = 'chatbot-container';
        chatbotDiv.style.position = 'fixed';
        chatbotDiv.style.bottom = '20px';
        chatbotDiv.style.right = '20px';
        chatbotDiv.style.width = '300px';
        chatbotDiv.style.height = '400px';
        chatbotDiv.style.border = '1px solid #ccc';
        chatbotDiv.style.backgroundColor = 'white';
        chatbotDiv.style.borderRadius = '10px';
        chatbotDiv.style.overflow = 'hidden';
        chatbotDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        document.body.appendChild(chatbotDiv);

        chatbotDiv.innerHTML = `
            <div id="chatbot-header" style="padding: 10px; background-color: #007bff; color: white; cursor: pointer; text-align: center;">Chatbot</div>
            <div id="chatbot-body" style="padding: 10px; height: 350px; overflow-y: auto;"></div>
            <input id="chatbot-input" type="text" style="width: 100%; padding: 10px; border: none; border-top: 1px solid #ddd;" placeholder="Type your message...">
        `;

        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotBody = document.getElementById('chatbot-body');

        chatbotInput.addEventListener('keypress', async function(event) {
            if (event.key === 'Enter') {
                const userMessage = chatbotInput.value;
                if (!userMessage) return;

                chatbotBody.innerHTML += `<div style='text-align: right; margin: 5px;'>You: ${userMessage}</div>`;
                chatbotInput.value = '';

                // Here you can replace with your own API URL
                try {
                    const response = await axios.post('/api/chatbot', { message: userMessage });
                    const botMessage = response.data.reply;
                    chatbotBody.innerHTML += `<div style='text-align: left; margin: 5px;'>Bot: ${botMessage}</div>`;
                    chatbotBody.scrollTop = chatbotBody.scrollHeight;
                } catch (error) {
                    chatbotBody.innerHTML += `<div style='text-align: left; margin: 5px; color: red;'>Error: Unable to connect to server.</div>`;
                }
            }
        });
    }
})();
