// chat-widget.js - Selbstgehosteter Chat Widget Code für schnitt.media

(function () {
    const config = window.ChatWidgetConfig || {};

    // Funktion zum Erstellen des iFrames
    function createIframe() {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style[config.style.position || 'right'] = '20px';
        iframe.style.bottom = '20px';
        iframe.style.width = '400px';
        iframe.style.height = '500px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';
        iframe.style.zIndex = '9999';
        iframe.src = 'about:blank';
        document.body.appendChild(iframe);
        return iframe;
    }

    // Erstelle das Widget
    const widget = document.createElement('div');
    widget.style.position = 'fixed';
    widget.style[config.style.position || 'right'] = '20px';
    widget.style.bottom = '20px';
    widget.style.width = '60px';
    widget.style.height = '60px';
    widget.style.backgroundColor = config.style.primaryColor || '#f4d03f';
    widget.style.borderRadius = '50%';
    widget.style.cursor = 'pointer';
    widget.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    widget.innerHTML = '<img src="' + config.branding.logo + '" style="width: 100%; height: 100%; border-radius: 50%;">';
    document.body.appendChild(widget);

    // Erstelle iFrame bei Klick
    let iframe;
    widget.addEventListener('click', function () {
        if (!iframe) {
            iframe = createIframe();
        }
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: ${config.style.backgroundColor}; color: ${config.style.fontColor}; }
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
                                route: '${config.webhook.route}'
                            })
                        }).then(response => response.json())
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
        iframeDoc.close();
    });
})();
