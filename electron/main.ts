import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
const { protocol } = require( 'electron' )
const nfs = require( 'fs' )
const npjoin = require( 'path' ).join
const es6Path = npjoin( __dirname, 'www' )

protocol.registerSchemesAsPrivileged([
  { scheme: 'es6', privileges: { standard: true } }
])

app.on( 'ready', () => {
  protocol.registerBufferProtocol( 'es6', ( req, cb ) => {
    nfs.readFile(
      npjoin( es6Path, req.url.replace( 'es6://', '' ) ),
      (e, b) => { cb( { mimeType: 'text/javascript', data: b } ) }
    )
  })
})

let win: BrowserWindow
app.on('ready', createWindow)

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/angular-electron/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  )

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}
