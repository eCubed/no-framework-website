# Initial Webpack Setup

In short, Webpack is a tool that will put together exactly the files that would run on a server. In the past, about 15-20 years ago, we created the *exact* files *at development time* that would end up *in production*. We will instead create a development project structure whose code and structure will remain developer-friendly. When it's time to show the work in a browswer, Webpack will round up all of our developer files and put together files that will be run on the browser. The generated files are definitely less developer-friendly to look at, especially in production, but those are for the browser anyway. Anything that we code WILL end up on the browser.

So, I'll need to install `webpack` and `webpack-cli`:

`npm i --save-dev webpack webpack-cli`

This will modify `package.json`. Because I specified the flag `--save-dev`, it will put both packages under the `devDependencies` folder. Anything listed under `devDependencies` are packages needed to develop the project, not run them. So, if someone were to clone this repo on their machines, they'll need to run `npm i` to install all of the packages listed under `devDependencies` to run it.

## Goal Review

So far, I've created three html pages and their corresponding JS files. I want Webpack to look at my source files and generate a few files that the browser can read and run.

I'll tell straight-up right now that "vanilla" Webpack can't do what I'm asking. The purpose of Webpack originally, is to be given script files, either JS or TS (which we'll work towards), and then output every other kind of file that the script file calls for to include. It wasn't made to read CSS or html files and copy them to a folder. Since I've got distinct html files I want outputted, I'll need to install `html-webpack-plugin`:

`npm i --save-dev html-webpack-plugin`

Now, I'm ready to create a configration file.

## The Initial Webpack Configuration File

Since we're developing right now, we'll call the configration file `webpack.development.config.js`.

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

"use strict";
{
  const distFolder = require('path').resolve(__dirname, "dist");
  module.exports = {
    mode: "development",
    entry: {
      index: "./src/index.js",
      about: "./src/about.js",
      contact: "./src/contact.js"
    },
    output: {
      filename: '[name].js',
      path: distFolder
    },
    plugins: [
      createHtmlWebpackPluginFor('index'),
      createHtmlWebpackPluginFor('about'),
      createHtmlWebpackPluginFor('contact')
    ]
  };
}

function createHtmlWebpackPluginFor(pageName) {
  return new HtmlWebpackPlugin({
    template: `./src/${pageName}.html`,
    filename: `${pageName}.html`,
    inject: "body",
    chunks: [`${pageName}`]
  });
}
```

This seems like a truckload for such a simple task. I'll go through the most important parts, though not in the order as it appears in the code.

I set `mode: "development"` to tell Webpack NOT to minify the html, CSS, or JS that will be generated. Even during development, I may sometimes want to take a peek at what Webpack did to get an understanding of how the code I write is transformed for the browser. A vale of prodction will perform minification.

`entry` is an object whose property names are exactly the name of the JS files we want Webpack to start working from. Though our goal is to generate html files primarily, Webpack was created to start its job at script files. We'll get to html generation later.

`output` is an object serving as a setting for generation of the JS files off the `entry` object. Notice that `filename: [name].js`. The `[name]` is a special placeholder for the name of the JS file to be generated. Since at `entry` we have 3 properties, Webpack will go through each of those properties and create a JS file for each one. The `path`, which is our `/dist` folder is where we'll output those files. I'm using the `path` tool (available from Node to Webpack Config) and the `__dirname`, which is the absolute path to the project root to formulate the path to the `/dist` folder: `const distFolder = require('path').resolve(__dirname, "dist");`

## Managing HTML Files

To handle html files, specifically to output them to the `/dist` folder, I'm going to need to use the `HtmlWebpackPlugin` that I previously installed. I declare it at the top of the configration file:

`const HtmlWebpackPlugin = require('html-webpack-plugin');`

Webpack configuration has a `plugins` array that we populate plugins. We can think of a Webpack plugin as an added capability to process (and maybe output) files other than JS files.

Since I have 3 html pages, I will need to create an instance of `HtmlWebpackPlugin` for each one of them. I load all three to the `plugins` array. I created a helper function, `createHtmlWebpackPluginFor(pageName)` to save a few lines of code in the config.

## Running Webpack

I can run webpack straight from the command prompt, but that's tedious. Instead, I'll create a script entry on `package.json` and give it an identifier:

package.json
```json
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:dev": "webpack --config webpack.development.config.js"
  },
  ...
```

I named the script `build:dev` because my intention is to generate readable html since I'm in development. I then specify which webpack config file I want with the `--config` flag. Right now, there's only one, but later, I'll want a separate configuration for production.

Now, I run on the prompt `npm run build:dev`.

## Examining The Generated Files

If there are no errors when I run `build:dev`, Webpack will generate the 6 files onto the `/dist` folder. I'm going to peek inside one of the html files. I notice that there is now a `<script>` tag that references the JS file of the same file name as the referencing html file. Webpack created the JS files first, and `HtmlWebpackPlugin` inserted the script reference into the html file.

I know that my source JS files are empty, but the corresponding files outputted to `/dist` have a bunch of JS code that looks awfully cryptic. It is not necessary to know exactly what's going on. It's important to know that what I see there will run whatever code I have at development at the browser.


