# gOsh

Electron app in various flavours to be used as a Kiosk running on a Raspberry Pi.


## The Capacitor approach

Create an Ionic app as usual, and build it to create the www file.  Then this:
```
npm install --save @capacitor/core @capacitor/cli
npx cap init
npx cap add electron
npx cap copy
npx cap open electron
```

```
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
