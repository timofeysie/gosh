# gOsh

Electron app in various flavours to be used as a Kiosk running on a Raspberry Pi.


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





## Workflow

```
ionic build
npm start
```




# Proposed prjects


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
