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





# Electron & React

The React Electron app is on the react-electron branch.

## Workflow


Run the app in development:
```
yarn electron-dev
```

Run this command to package the app:
```
yarn electron-pack
```

Run the unit tests:
```
npm test
```


Find out more about deployment [here](https://bit.ly/CRA-deploy).

```
$ build -mw
/bin/sh: build: command not found
error Command failed with exit code 127.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

## setup

In the package.json there are the following scripts.
```
"preelectron-pack": "yarn build" will build the CRA.
"electron-pack": "build -mw" packages the app for Mac (m) and Windows (w).
```

#
## Adding Redux

Copied the redux directory from Apaca and re-created the List and Form components but items are not being added to the list.  After trying the add, after a few seconds there are some things like this in the console:
```
"Empty response arrived for script 'chrome-devtools://devtools/remote/serve_file/@10883df2e1a5aebd67e8b70fa71ebc5988b23b5d/product_registry_impl/product_registry_impl_module.js'", source: chrome-devtools://devtools/bundled/shell.js (24)
[1] [18304:0713/212651.682067:ERROR:CONSOLE(108)] "Uncaught (in promise) Error: Could not instantiate: ProductRegistryImpl.Registry", source: chrome-devtools://devtools/bundled/shell.js (108)
```

Sorry, it's not the browser console (which is actually an Electron window), those messages are in the command terminal.  But actually, I'm not able to reproduce that, so maybe those are not related to the problem of adding items.

#
## Unit testing with Jest

in Form.jsx, we use the add action by importing it like this:
```
import { addArticle } from "../redux/actions/index";
```


But the error we get for that is:
```
FAIL  src/redux/test/actions.spec.js
 ● Test suite failed to run
   Jest encountered an unexpected token
   This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.
   By default, if Jest sees a Babel config, it will use that to transform your files, ignoring "node_modules".
   Here's what you can do:
    • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
    • If you need a custom transformation specify a "transform" option in your config.
    • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.
   You'll find more details and examples of these config options in the docs:
   https://jestjs.io/docs/en/configuration.html
   Details:
   /Users/tim/react/gosh/src/redux/test/actions.spec.js:1
   ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import { addArticle } from '../actions/index';
```

That's a lot of info for a failed tests.  Since the action is actually a JavScript file, I'm not sure any of the info there is meaningful.  But I'm not sure.  We have some Babel stuff in yarn.lock, but there is no Babel in the package.json, and no babel config file.  

This is just a create-react-app project.  Does that use Babel out of the box?

Because of this I didn't install the Babel-Jest bridge fron [the official Redux testing guide](https://redux.js.org/recipes/writing-tests) like so:
```
npm install --save-dev babel-jest
```

Tried that and ran again but same result.

So the [StackOverflow](https://stackoverflow.com/questions/51994111/jest-encountered-an-unexpected-token) chosen answer for this kind of error is to put this in the package.json:
```
"transform": {
  "\\.js$": "<rootDir>/node_modules/babel-jest"
},
```

Same error.  So does create-react-app use Babel?
Google: *Create React App uses Webpack and Babel under the hood, but it generates only the files you need to work on your React project. If you've built React apps before, you're not going have access to configuration files for Webpack, Babel, ESLint, etc.*

Since it also comes built in with Jest from the start, maybe this is on the Electron side of things?  Time to create a vanilla React/Electron project and see how the unit tests run out of the box.

The steps go:
```
npx create-react-app gosh
cd gosh
yarn add electron electron-builder --dev
yarn add wait-on concurrently --dev
yarn add electron-is-dev
Create a new file, public/electron.js
Add the electron-dev command to the package.json scripts tag.
Add the main tag to package.json
```

Then try the npm test command.  There is one test: App.test.js.  It passes.

There is no assertion in the test:
```
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

So that's nice.  Moving on, adding the build step for the Electron project:
```
yarn add @rescripts/cli @rescripts/rescript-env --dev
change the scripts tags in package.json from react-scripts to rescripts
add new files called .rescriptsrc.js and .webpack.config.js
yarn add electron-builder typescript --dev
Set the homepage property in package.json
Add postinstall, preelectron-pack, build, author and electron-pack to package.json
```

After all that, we have a problem:
```
$ npm test
> gosh@0.1.0 test /Users/tim/react/electron/gosh
> rescripts test
sh: rescripts: command not found
npm ERR! Test failed.  See above for more details.
```

That looks a lot like the first two steps.  Ran this again:
```
yarn add @rescripts/cli @rescripts/rescript-env --dev
```

Then the test passes.  Out of curiosity, ran *yarn electron-pack* to test out the build but got the */bin/sh: build: command not found* error again like the first attempt.  Oh well.

Next, add Redux and this time run the tests between each step of the process.  But first, running the build command again to confirm that that still works and we get this error:
```
external "crypto":1 Uncaught ReferenceError: require is not defined
    at Object.crypto (external "crypto":1)
    at __webpack_require__ (bootstrap:781)
    at fn (bootstrap:149)
```

Trying to resolve this error using the solution on [this StackOverflow](https://stackoverflow.com/questions/49932203/module-not-found-error-cant-resolve-fs-using-webpack) question.

In the terminal the error is:
```
Failed to compile.
[0] ./node_modules/react-scripts/node_modules/react-dev-utils/formatWebpackMessages.js
[0] Module not found: Can't resolve '/Users/tim/react/electron/gosh/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/slicedToArray' in '/Users/tim/react/electron/gosh/node_modules/react-scripts/node_modules/react-dev-utils'
```

Trying this solution:
```
npm add @babel/runtime
```

That doesn't help.  The tests might pass, but the app won't run. Great.  It's been about three hours now.  What's the next step?


#
## Requirements

This project is set up to demonstrate a react-based app with electron.
This app will talk to a RESTful API end point written in node.js.

*Show off your knowledge where you can, eg. unit test*

* Runs on Windows
* RESTful API Endpoint written in node.js
* Interaction between electron.js application and API endpoint.

Given that this is a pre-interview screening test, it is only appropriate to spend a few hours at most on it.  So there is not much room for anything special.

So far there is a React app using Create React App and and Electron dev build set up.  That took about 30 minutes.  There is already a problem with the deployment detailed [in issue #3](https://github.com/timofeysie/gosh/issues/3).

To make it interesting, the plan is implement Redux to hold the state of a list of items from a WikiData call.  Using the code from [a recent project](https://github.com/timofeysie/acapana) to create the queries, then write tests for that.

The API part will be to save the added search items on the server.  Doing this and testing both sides will take at least a few hours.


#
## The list

The *display* property with a value of *list-item* creates a block-level box,
with an additional marker box.
The marker box is where the list bullet or number is added.

https://www.smashingmagazine.com/2019/07/css-lists-markers-counters/


#
## Original Readme

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify



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
