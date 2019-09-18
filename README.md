# gOsh

Electron app in various flavours to be used as a Kiosk running on a Raspberry Pi.

The code in main.ts file runs on the main process.  This can use the usual Node APIs.  This process spawns the second one by opening the browser window.  The second process depends on what files are loaded in the index.html file.  It could be vanilla JS, React, Angular or any other web tech.

The Electron eco-system offers two options for native ES modules: Chromium's module loading subsystem or Custom NodeJS loaders via Node's module loading subsystem which is recommended.

There is [some destructuring craziness](https://gist.github.com/smotaal/f1e6dbb5c0420bfd585874bd29f11c43) shown:
```Javascript
const { mainModule } = process, { error } = console;
function createProtocol(scheme, base, normalize = true) {
  const mimeTypeFor = require('./mime-types'),
    { app, protocol } = require('electron'),
    { URL } = require('url'),
    { readFileSync: read } = require('fs'),
    { _resolveFilename: resolve } = require('module');
  // Should only be called after app:ready fires
  if (!app.isReady())
    return app.on('ready', () => createProtocol(...arguments));
```



## The Angular approach

Using [this article](https://malcoded.com/posts/angular-desktop-electron/) to set up an Angular Electron app.
```
ng new angular-electron
npm i -D electron
npm i -D @types/electron
```

Also:
* Create the main.ts file for the basics of the Electron app.
* Create a new script inside of our package.json and tell electron the entry point of our electron application. We do so by specifying the "main"-property in the package.json.

```
npm run electron
```

After having issues with Ionic setup, and getting similar issues with an plain Angular version.
When creating an Angular/Electron flavor, after getting this error:

electron Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
Following the advice from [StackOverflow here](https://stackoverflow.com/questions/51113097/electron-es6-module-import/51126482) fixed the issue.

The advice in an un-accepted answer says *in the event that you just need to get it deployed:  Change "target": "es2015" to "target": "es5" in your tsconfig.json file*

The app runs, but there is still one error in the console:
```
Failed to load resource: net::ERR_NOT_IMPLEMENTED
```

Obvisouly a show stopper.  Just wish the Ionic version would work also.  The accepted answer to the SO link above goes on to say:
*the corresponding HTML spec, disallows import via file:// (For XSS reasons) and a protocol must have the mime types defined.  The file protocol you use client:// has to set the correct mime-types when serving the files. Currently i would guess they are not set when you define the protocol via protocol.registerBufferProtocol thus you recive a The server responded with a non-JavaScript MIME type of "", the gist above has a code sample on how to do it.  Edit: I just want to emphasize the other answers here do only cover the absolute minimum basics implementation with no consideration of exceptions, security, or future changes. I highly recommend taking the time and read trough the gist I linked.*

[This is the Gist](https://gist.github.com/smotaal/f1e6dbb5c0420bfd585874bd29f11c43).

The rest of the article talks about accessing the file system from the app.


## The Capacitor approach

Using the [official documents](https://capacitor.ionicframework.com/docs/electron/) as a guide.
Create an Ionic app as usual, and build it to create the www file.  Then this:
```
npm install --save @capacitor/core @capacitor/cli
npx cap init
npx cap add electron
npx cap copy
npx cap open electron
```

Workflow
```
ionic build
npm start
npx cap open electron
```

This works to run an Electron app, but the window is empty, and the console log shows:
```
runtime-es2015.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
polyfills-es2015.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
styles-es2015.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
vendor-es2015.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
main-es2015.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
/Users/tim/electron/…ity-warnings.js:272 Electron Deprecation Warning (contextIsolation default change) This window has context isolation disabled by default. In Electron 5.0.0, context isolation will be enabled by default. To prepare for this change, set {contextIsolation: false} in the webPreferences for this window, or ensure that this window does not rely on context isolation being disabled, and set {contextIsolation: true}.
For more information, see https://electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content
/Users/tim/electron/…ity-warnings.js:170 Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
    Policy set or a policy with "unsafe-eval" enabled. This exposes users of
    this app to unnecessary security risks.
For more information and help, consult
https://electronjs.org/docs/tutorial/security.
 This warning will not show up
once the app is packaged.
```

Replace
```
  <base href="/" />
```
with
```
<base href="./">
```

Then the console error is:
```
GET file:///runtime-2s2015.js net::ERR_FILE_NOT_FOUND
```

In the electron/app directory there are files going from 0 to 78 starting at 0-es2015.js.

Looking at the error message, it's coming from this line in the index.html:
```
<body>
  <app-root></app-root>
    <script src="runtime-es2015.js" type="module"></script>
    <script src="polyfills-es2015.js" type="module"></script>
    <script src="runtime-es5.js" nomodule></script>
    <script src="polyfills-es5.js" nomodule></script>
    <script src="styles-es2015.js" type="module"></script>
    <script src="styles-es5.js" nomodule></script>
    <script src="vendor-es2015.js" type="module"></script>
    <script src="main-es2015.js" type="module"></script>
    <script src="vendor-es5.js" nomodule></script>
    <script src="main-es5.js" nomodule>
</script>
</body>
```

Since we have chunks of equating to modules and not specific type bundles, something has to change.

After trying again with the Capacitor approach and debugging the same result, it appears that the *npx cap open electron* command needs to be run from within the electron directory in the project.  

That will then cause a new error:
```
>npx cap open electron
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\Windows\py.exe -c import sys; print "%s.%s.%s" % sys.version_info[:3];
gyp ERR! stack   File "<string>", line 1
gyp ERR! stack     import sys; print "%s.%s.%s" % sys.version_info[:3];
gyp ERR! stack                                ^
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
gyp ERR! stack     at ChildProcess.emit (events.js:196:13)
gyp ERR! stack     at maybeClose (internal/child_process.js:1000:16)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:267:5)
gyp ERR! System Windows_NT 10.0.17763
gyp ERR! command "C:\\Program Files\\nodejs\\node.exe" "C:\\Users\\timof\\AppData\\Roaming\\nvm\\v12.0.0\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js" "rebuild"
gyp ERR! cwd C:\Users\timof\AppData\Roaming\npm-cache\_npx\16532\node_modules\cap
gyp ERR! node -v v12.0.0
gyp ERR! node-gyp -v v3.8.0
gyp ERR! not ok
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! cap@0.2.1 install: `node-gyp rebuild`
npm ERR! Exit status 1
npm ERR! Failed at the cap@0.2.1 install script.
Install for [ 'cap@latest' ] failed with code 1
```

Python is installed:
```
>python --version
Python 2.7.15
```

Only a few nibbles on Google suggest something like this:
```
https://github.com/felixrieseberg/windows-build-tools/issues/33

npm --add-python-to-path='true' --debug install --global windows-build-tools
or
npm config set python "c:\Python\27\python.exe"
```

Since windows build tools have already been installed on this computer, there must be another answer.  Since the last time while installing it to get the work repo to run, what worked was to use yarn instead of npm.  Time to try that on this project.

From the start.  First create a new Ionic app:
```
ionic start whisky blank
cd whisky
ionic build
```

Then, add Capacitor and Electron:
```
npm install --save @capacitor/core @capacitor/cli
npx cap init
```

That last step asks you the big question: npm or yarn?
Next
```
npx cap add electron
npx cap copy
npx cap open electron
```

Also, trying to use the subdirectory with yard fails and despite opening a blank electron window, the console log error is the same:
```
GET file:///C:/runtime-es2015.js net::ERR_FILE_NOT_FOUND
```

The Ionic build still is not connected to the Electron build.
Using *yarn start* is the same as *npm start*, it runs the *gn serve* command and deploys the Ionic app.  No problems there.




Using the common fix for the error as detailed [here](https://github.com/ionic-team/capacitor/issues/888), namely, replacing
```
<base href="/">
```
with
```
<base href="./">
```

We still however get a blank app along with the following in the console log:
```
main-es2015.js:1 Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
runtime-es2015.js:1 Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
styles-es2015.js:1 Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
polyfills-es2015.js:1 Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
vendor-es2015.js:1 Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:272 Electron Deprecation Warning (contextIsolation default change) This window has context isolation disabled by default. In Electron 5.0.0, context isolation will be enabled by default. To prepare for this change, set {contextIsolation: false} in the webPreferences for this window, or ensure that this window does not rely on context isolation being disabled, and set {contextIsolation: true}.

For more information, see https://electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content
warnAboutContextIsolationDefault @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:272
logSecurityWarnings @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:313
loadHandler @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:335
C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:170 Electron Security Warning (Insecure Content-Security-Policy) This renderer process has either no Content Security
    Policy set or a policy with "unsafe-eval" enabled. This exposes users of
    this app to unnecessary security risks.

For more information and help, consult
https://electronjs.org/docs/tutorial/security.
 This warning will not show up
once the app is packaged.
isUnsafeEvalEnabled.then @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:170
Promise.then (async)
warnAboutInsecureCSP @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:163
logSecurityWarnings @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:310
loadHandler @ C:\Users\timof\repos\temp\ionic\whisky\electron\node_modules\electron\dist\resources\electron.asar\renderer\security-warnings.js:335
```

Trying some more ideas further down in the issue linked to above:
```
cd electron
npm install @capacitor/electron@1.0.0-beta.11 --save
npm install electron@3.0.10 --save-dev
```

Next solution: Change "target": "es2015" to "target": "es5" in your tsconfig.json file.
```
ionic build
Failed to load module script: The server responded with a non-JavaScript MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec.
```

We might need a *type="text/javascript"* or something in the index.html file.  But where?

Going to try all the steps again on the mac now.

## The Yazeee Method

Following the [Yalzeee](https://steemit.com/utopian-io/@yalzeee/ionic-tutorials-working-with-electron-api-s) method for setting up an Ionic app with Electron.

After changing the package.json to configure the scripts, on the first run, we get this result:
```
$ ionic build
> npm run ionic:build
> kosh@0.0.1 ionic:build /Users/tim/electron/gosh
> ionic-app-scripts build
sh: ionic-app-scripts: command not found
```

Did run npm i after changing the package file?  No, that doesn't help.  It looks like this is an issue with npm install.  Trying this:
```
delete node_modules > run npm install --dev > run npm install
```

```
$ npm start
npm ERR! file /Users/tim/electron/gosh/package.json
npm ERR! code EJSONPARSE
npm ERR! JSON.parse Failed to parse json
npm ERR! JSON.parse Unexpected token } in JSON at position 530 while parsing near '...d && electron .",
npm ERR! JSON.parse   },
npm ERR! JSON.parse   "private": true...'
npm ERR! JSON.parse Failed to parse package.json data.
npm ERR! JSON.parse package.json must be actual JSON, not just JavaScript.
```

Although I've heard it stated that it's good practice to include a comma at the end of lines in JSON even when there is no other items next, in this case, it causes an error:
```
"start": "npm run build && electron .",
},
```

Remove the comma there before the end and the script runs.  Then we're back to the first error:
```
ionic-app-scripts: command not found
```

Trying this:
```
$ npm i ionic-app-scripts
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/ionic-app-scripts - Not found
npm ERR! 404  'ionic-app-scripts@latest' is not in the npm registry.
npm ERR! 404 Your package name is not valid, because
npm ERR! 404  1. name can only contain URL-friendly characters
```

This is the advice for that error:
```
npm install @ionic/app-scripts@latest --save-dev
```

And the next error:
```
[17:02:07]  TypeError: Cannot read property 'replace' of null
```
Some advice was that the author tag needs to be in the package.json file with the name, email and url properties.  But with that, we still get the error:
```
[17:25:52]  build dev started ...
[17:25:53]  typescript error
            Argument for '--lib' option must be: 'es5', 'es6', 'es2015', 'es7', 'es2016', 'es2017', 'esnext', 'dom',
            'dom.iterable', 'webworker', 'scripthost', 'es2015.core', 'es2015.collection', 'es2015.generator',
            'es2015.iterable', 'es2015.promise', 'es2015.proxy', 'es2015.reflect', 'es2015.symbol',
            'es2015.symbol.wellknown', 'es2016.array.include', 'es2017.object', 'es2017.sharedmemory', 'es2017.string',
            'es2017.intl', 'esnext.asynciterable'.
[17:25:53]  ionic-app-script task: "build"
[17:25:53]  TypeError: Cannot read property 'replace' of null
```

SO: *For TypeScript 3.3.3, just add es2018.promise to your tsconfig.json - compilerOptions.lib config like this*
```
"lib": ["es2015", "es2016", "dom", "es2018.promise"]
```

With that line in the tsconfig file, we still get this error:
```
[17:50:46]  typescript error
            Argument for '--lib' option must be: 'es5', 'es6', 'es2015', 'es7', 'es2016', 'es2017', 'esnext', 'dom',
            'dom.iterable', 'webworker', 'scripthost', 'es2015.core', 'es2015.collection', 'es2015.generator',
            'es2015.iterable', 'es2015.promise', 'es2015.proxy', 'es2015.reflect', 'es2015.symbol',
            'es2015.symbol.wellknown', 'es2016.array.include', 'es2017.object', 'es2017.sharedmemory', 'es2017.string',
            'es2017.intl', 'esnext.asynciterable'.
[17:50:47]  ionic-app-script task: "build"
[17:50:47]  TypeError: Cannot read property 'replace' of null
```

Used the exact same string of options listed above and the error changes to somthing like this:
```
[17:55:51]  ionic-app-script task: "build"
[17:55:51]  Error: /Users/tim/electron/gosh/src/app/main.ts was not found. The "main.dev.ts" and "main.prod.ts" files have been deprecated. Please create a new file "main.ts" containing the content of "main.dev.ts", and then delete the deprecated files.
For more information, please see the default Ionic project main.ts file here: https://github.com/ionic-team/ionic2-app-base/tree/master/src/app/main.ts
    at new BuildError (/Users/tim/electron/gosh/node_modules/@ionic/app-scripts/dist/util/errors.js:16:28)
    at /Users/tim/electron/gosh/node_modules/@ionic/app-scripts/dist/build/util.js:92:21
npm ERR! code ELIFECYCLE
```

Been there?  Done that?  Me too.  Maybe Capacitor is the answer here.
Apparently Capacitor has [First-class Electron and PWA support](https://ionicframework.com/blog/announcing-capacitor-1-0/).

In the official docs however, it says this: *Capacitor has preliminary support for Electron.  Electron support for Capacitor is currently in preview, and lags behind iOS, Android, and Web support.*.





## Workflow

```
ionic build
npm start
```




# Proposed projects


## The tank of sea combs project

A fish tank filled with ctenphora and a video camera projecting a small piece onto the wall.

The comb rows of most planktonic ctenophores produce a rainbow effect, which is not caused by bioluminescence but by the scattering of light as the combs move.

[Diffraction](https://en.wikipedia.org/wiki/Diffraction) refers to various phenomena that occur when a wave encounters an obstacle or a slit. It is defined as the bending of waves around the corners of an obstacle or through an aperture into the region of geometrical shadow of the obstacle/aperture. The diffracting object or aperture effectively becomes a secondary source of the propagating wave. Italian scientist Francesco Maria Grimaldi coined the word "diffraction" and was the first to record accurate observations of the phenomenon in 1660.


## The cat laser toy project

https://learn.adafruit.com/raspberry-pi-wifi-controlled-cat-laser-toy/hardware

## The head with eyes tracking a bystander project

https://learn.adafruit.com/crickit-controlled-animatronic-eyeball


## The lidar scanner project

### lidar & bot

https://medium.com/robotics-with-ros/installing-the-rplidar-lidar-sensor-on-the-raspberry-pi-32047cde9588
https://www.dexterindustries.com/product/gopigo-beginner-starter-kit/

### point cloud w ardruino

https://www.elektormagazine.com/news/lidar-arduino-raspberry-pi-laser-tof-and-more


## The broken store light projects

Controlling lights to appear like a defective set of petrol station store lights.


## The art bot project
https://medium.com/@jonbell/artbot-says-hello-1023a2b3bfc8
ArtBot by https://www.jonbell.net/software/

## Jussie Smollet project

https://en.wikipedia.org/wiki/Jussie_Smollett_alleged_assault



# The first Ionic Electron attempt

App setup according to the [official docs](https://electronjs.org/docs/tutorial/first-app) as a step prior to creating an Ionic Electron app as [described here](https://ionicframework.com/docs/publishing/desktop-app).

The second link there on the Ionic site actually doesn't explain anything about combining the two frameworks, so looking at [this article](https://medium.com/@LohaniDamodar/lets-make-desktop-application-with-ionic-3-and-electron-44316f82901d).

After creating a new app using a new demo starter, got this:
```
[ng] ERROR in ./src/global.scss (./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src??embedded!./node_modules/sass-loader/lib/loader.js??ref--14-3!./src/global.scss)
[ng] Module build failed (from ./node_modules/sass-loader/lib/loader.js):
[ng] Error: Cannot find module 'node-sass'
```

Trying this solution:
```
npm install --save-dev  --unsafe-perm node-sass
```

It works.

Next,
```
npm install electron electron-builder foreman --save-dev
```
