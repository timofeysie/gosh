# Ionic v4 Electron app

Based on the "Tutorial: Photo Gallery app"

A tutorial app that walks the user through creating a Photo Gallery app. We begin with the Ionic "tabs" starter app, incrementally converting the About tab to a Photo Gallery experience.

## Structure
The complete source code is contained within. Please follow along with the [complete guide here](https://beta.ionicframework.com/docs/developer-resources/guides/first-app-v4/intro/).

## How to Run Locally
* Clone this repo.
* Open a terminal window, and navigate to this repo on the filesystem.
* Run "npm install" to install all required project dependencies.
* Run "ionic serve" to run the app in a web browser locally.


# Vanilla JS Electron version

The code for this in on the 'vanilla-js' branch.

The app was setup according to the [official docs](https://electronjs.org/docs/tutorial/first-app) as a step prior to creating an Ionic Electron app as [described here](https://ionicframework.com/docs/publishing/desktop-app).

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
