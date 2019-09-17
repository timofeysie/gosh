"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var protocol = require('electron').protocol;
var nfs = require('fs');
var npjoin = require('path').join;
var es6Path = npjoin(__dirname, 'www');
protocol.registerSchemesAsPrivileged([
    { scheme: 'es6', privileges: { standard: true } }
]);
electron_1.app.on('ready', function () {
    protocol.registerBufferProtocol('es6', function (req, cb) {
        nfs.readFile(npjoin(es6Path, req.url.replace('es6://', '')), function (e, b) { cb({ mimeType: 'text/javascript', data: b }); });
    });
});
var win;
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/angular-electron/index.html"),
        protocol: 'file:',
        slashes: true,
    }));
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
//# sourceMappingURL=main.js.map