


#
## Workflow


Run the app in development:
```
yarn electron-dev
```

Run this command to package the app:
```
yarn electron-pack
```

Find out more about deployment [here](https://bit.ly/CRA-deploy).

```
$ build -mw
/bin/sh: build: command not found
error Command failed with exit code 127.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```


#
## React & Electron

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
