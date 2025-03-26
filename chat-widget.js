// chat-widget.js - Basierend auf Wayne Simpsons Originalcode

(function () {
    const config = window.ChatWidgetConfig || {};

    // Erstelle das Widget-Icon
    const widgetButton = document.createElement('div');
    widgetButton.style.position = 'fixed';
    widgetButton.style[config.style.position || 'right'] = '20px';
    widgetButton.style.bottom = '20px';
    widgetButton.style.width = '60px';
    widgetButton.style.height = '60px';
    widgetButton.style.backgroundColor = config.style.primaryColor || '#f4d03f';
    widgetButton.style.borderRadius = '50%';
    widgetButton.style.cursor = 'pointer';
    widgetButton.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    widgetButton.innerHTML = `<img src="${config.branding.logo}" style="width: 100%; height: 100%; border-radius: 50%;">`;
    document.body.appendChild(widgetButton);

    let iframe;
    let isOpen = false;

    widgetButton.addEventListener('click', function () {
        if (isOpen) {
            document.body.removeChild(iframe);
            isOpen = false;
        } else {
            iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style[config.style.position || 'right'] = '20px';
            iframe.style.bottom = '80px';
            iframe.style.width = '350px';
            iframe.style.height = '500px';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '12px';
            iframe.style.zIndex = '9999';

            document.body.appendChild(iframe);

            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: ${config.style.backgroundColor || '#ffffff'}; color: ${config.style.fontColor || '#333333'}; }
                        button { padding: 10px 15px; background-color: ${config.style.primaryColor}; color: white; border: none; border-radius: 4px; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <h3>${config.branding.welcomeText}</h3>
                    <textarea id="userMessage" rows="4" style="width: 100%; padding: 5px;"></textarea><br><br>
                    <button id="sendMessage">Nachricht senden</button>
                    <div id="responseMessage" style="margin-top: 20px;"></div>
                    <script>
                        document.getElementById('sendMessage').onclick = function () {
                            const userMessage = document.getElementById('userMessage').value;
                            fetch('${config.webhook.url}', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    message: userMessage,
                                    route: '${config.webhook.route || 'general'}'
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('responseMessage').innerText = data.response || 'Vielen Dank für Ihre Nachricht!';
                            })
                            .catch(error => {
                                document.getElementById('responseMessage').innerText = 'Fehler beim Senden der Nachricht.';
                                console.error('Fehler:', error);
                            });
                        };
                    </script>
                </body>
                </html>
            `);
            doc.close();
            isOpen = true;
        }
    });
})();
