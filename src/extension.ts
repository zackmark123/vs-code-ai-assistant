import * as vscode from 'vscode';
import { OpenAIClient } from '@azure/openai';

export async function activate(context: vscode.ExtensionContext) {
    const aiClient = new OpenAIClient({
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: process.env.OPENAI_ENDPOINT
    });

    let disposable = vscode.commands.registerCommand('vs-code-ai-assistant.startChat', async () => {
        const panel = vscode.window.createWebviewPanel(
            'aiChat',
            'AI Assistant',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'analyze':
                    const response = await aiClient.getChatCompletions(
                        'gpt-4',
                        [{ role: 'user', content: message.text }]
                    );
                    panel.webview.postMessage({ 
                        type: 'response', 
                        content: response.choices[0].message?.content 
                    });
                    break;
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    .chat-container {
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                        padding: 20px;
                    }
                    .messages {
                        flex: 1;
                        overflow-y: auto;
                        margin-bottom: 20px;
                    }
                    .input-container {
                        display: flex;
                        gap: 10px;
                    }
                    #userInput {
                        flex: 1;
                        padding: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="chat-container">
                    <div class="messages" id="messages"></div>
                    <div class="input-container">
                        <input type="text" id="userInput" placeholder="Ask me anything...">
                        <button onclick="sendMessage()">Send</button>
                    </div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function sendMessage() {
                        const input = document.getElementById('userInput');
                        vscode.postMessage({
                            command: 'analyze',
                            text: input.value
                        });
                        input.value = '';
                    }

                    window.addEventListener('message', event => {
                        const message = event.data;
                        const messagesDiv = document.getElementById('messages');
                        messagesDiv.innerHTML += \`<p>\${message.content}</p>\`;
                    });
                </script>
            </body>
        </html>
    `;
}

export function deactivate() {}