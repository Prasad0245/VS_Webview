/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const HelloWorldPanel_1 = __importDefault(__webpack_require__(2));
function activate(context) {
    console.log('Congratulations, your extension "abcde" is now active!');
    // let disposable = vscode.commands.registerCommand('abcde.helloWorld', () => {
    // 	vscode.window.showInformationMessage('Hello World from abcde!');
    // });
    context.subscriptions.push(vscode.commands.registerCommand('abcde.helloWorld', () => {
        HelloWorldPanel_1.default.createOrShow(context.extensionUri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("abcde.ask", async () => {
        const answer = await vscode.window.showInformationMessage("How was your day?", "good", "bad");
        if (answer === "bad") {
            vscode.window.showInformationMessage("Sorry to hear that");
        }
        else {
            console.log({ answer });
        }
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __importStar(__webpack_require__(1));
const getNonce_1 = __webpack_require__(3);
class HelloWorldPanel {
    static currentPanel;
    static viewType = "swiper";
    _panel;
    _extensionUri;
    _disposables = [];
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (HelloWorldPanel.currentPanel) {
            HelloWorldPanel.currentPanel._panel.reveal(column);
            HelloWorldPanel.currentPanel._update();
            return;
        }
        const panel = vscode.window.createWebviewPanel(HelloWorldPanel.viewType, "SynapsePanel", column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
    static kill() {
        HelloWorldPanel.currentPanel?.dispose();
        HelloWorldPanel.currentPanel = undefined;
    }
    static revive(panel, extensionUri) {
        HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }
    dispose() {
        HelloWorldPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
                // case "tokens": {
                //   await Util.globalState.update(accessTokenKey, data.accessToken);
                //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
                //   break;
                // }
            }
        });
    }
    _getHtmlForWebview(webview) {
        // // And the uri we use to load this script in the webview
        // const scriptUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.js")
        // );
        // Local path to css styles
        // const styleResetPath = vscode.Uri.joinPath(
        //   this._extensionUri,
        //   "media",
        //   "reset.css"
        // );
        // const stylesPathMainPath = vscode.Uri.joinPath(
        //   this._extensionUri,
        //   "media",
        //   "vscode.css"
        // );
        // Uri to load styles into webview
        // const stylesResetUri = webview.asWebviewUri(styleResetPath);
        // const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        // const cssUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
        // );
        // Use a nonce to only allow specific scripts to be run
        const nonce = (0, getNonce_1.getNonce)();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content=img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="" rel="stylesheet">
        <script nonce="${nonce}">
        </script>
			</head>
      <body>
      <h1> Hello World! </h1>
			</body>
			</html>`;
    }
}
exports["default"] = HelloWorldPanel;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNonce = void 0;
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map