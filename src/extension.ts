// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { register } from 'module';
import * as vscode from 'vscode';
import HelloWorldPanel from './HelloWorldPanel';

export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "abcde" is now active!');

	// let disposable = vscode.commands.registerCommand('abcde.helloWorld', () => {
		
	// 	vscode.window.showInformationMessage('Hello World from abcde!');
	// });
	context.subscriptions.push(
		vscode.commands.registerCommand('abcde.helloWorld', () => {
			HelloWorldPanel.createOrShow(context.extensionUri);	
		})
		);

	context.subscriptions.push(
		vscode.commands.registerCommand("abcde.ask", async () => {
		  const answer = await vscode.window.showInformationMessage("How was your day?","good","bad");
	
		  if (answer === "bad") {
			vscode.window.showInformationMessage("Sorry to hear that");
		  } else {
			console.log({ answer });
		  }
		})
	  );
	}

// This method is called when your extension is deactivated
export function deactivate() {}
