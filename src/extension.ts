import * as vscode from 'vscode';
import { OpenAIClient } from '@azure/openai';

export async function activate(context: vscode.ExtensionContext) {
    // Initialize OpenAI client
    const aiClient = new OpenAIClient({
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: process.env.OPENAI_ENDPOINT
    });

    // Register chat command
    let disposable = vscode.commands.registerCommand('vs-code-ai-assistant.startChat', async () => {
        const panel = vscode.window.createWebviewPanel(
            'aiChat',
            'AI Assistant',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body { padding: 20px; }
                    #chat-container { height: 100vh; }
                </style>
            </head>
            <body>
                <div id="chat-container">
                    <h2>VS Code AI Assistant</h2>
                    <div id="messages"></div>
                </div>
            </body>
        </html>
    `;
}

export function deactivate() {}