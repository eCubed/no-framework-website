# Initial Webpack Setup

In short, Webpack is a tool that will transform source files into a set of files that would run on the browser.

In the past, about 15-20 years ago, we created the *exact* files *at development time* that would end up *in production*. So in other words, everybody could see *exactly* the codes and markup we wrote to get those web pages running. 

We will instead create a development project structure whose code and structure will remain developer-friendly. When it's time to show the work in a browswer, Webpack will round up all of our developer files and put together files that will be run on the browser. The generated files are definitely less developer-friendly to look at, especially in production, but those are for the browser to run anyway.

So, I'll need to install `webpack` and `webpack-cli`:

`npm i --save-dev webpack webpack-cli`

This will modify `package.json`. Because I specified the flag `--save-dev`, it will put both packages under the `devDependencies` folder. Anything listed under `devDependencies` are packages needed to develop the project, not run them. So, if someone were to clone this repo on their machines, they'll need to run `npm i` to install all of the packages listed under `devDependencies` to run it.

## Goal Review

So far, I've created three html pages and their corresponding JS files. I want Webpack to look at my source files and generate a few files that the browser can read and run.

I'll tell straight-up right now that "vanilla" Webpack can't do what I'm asking. The purpose of Webpack originally, is to be given script files, either JS or TS (which we'll work towards), and then output every other kind of file that the script file calls for to include. It wasn't made to read CSS or html files and copy them to a folder. Since I've got distinct html files I want outputted, I'll need to install `html-webpack-plugin`:

`npm i --save-dev html-webpack-plugin`

Now, I'm ready to create a configuration file.

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
      filename: '[name].[hash].js',
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

I set `mode: "development"` to tell Webpack NOT to minify the html, CSS, or JS that will be generated. Even during development, I may sometimes want to take a peek at what Webpack did to get an understanding of how the code I write is transformed for the browser. A value of `production` will perform minification.

`entry` is an object whose property names are exactly the name of the JS files we want Webpack to start working from. Though our goal is to generate html files primarily, Webpack was created to start its job at script files. We'll get to html generation later.

`output` is an object serving as a setting for generation of the JS files off the `entry` object. Notice that `filename: [name].[hash].js`. The `[name]` is a special placeholder for the name of the JS file to be generated. Since at `entry` we have 3 properties, Webpack will go through each of those properties and create a JS file for each one. 

The `[hash]` portion is a randomly-generated string of characters that will be part of the file name. There is only going to be one hash value per build run, so all of the JS files will include this hash in their file names. Why do we include a new hash? When the browser makes a request for files, it keeps track of the file name. If that file from the same server is requested again, there are times beyond our control as developers and users that the browser won't ask for the files again, and just apply the old copy it saved before. No, the browser doesn't know or doesn't care if the file requested could have changed since last request. It could just decide not to get a fresh copy sometimes. Therefore, when we create filenames with hash values, and they'll be different every time we build, the browser will always end up requesting a new file.

The `path`, which is our `/dist` folder is where we'll output those files. I'm using the `path` tool (available from Node to Webpack Config) and the `__dirname`, which is the absolute path to the project root to formulate the path to the `/dist` folder: `const distFolder = require('path').resolve(__dirname, "dist");`

## Managing HTML Files

To handle html files, specifically to output them to the `/dist` folder, I'm going to need to use the `HtmlWebpackPlugin` that I previously installed. I declare it at the top of the configration file:

`const HtmlWebpackPlugin = require('html-webpack-plugin');`

Webpack configuration has a `plugins` array that we populate with plugins. We can think of a Webpack plugin as an added capability to process (and maybe output) files other than JS files.

Since I have 3 html pages, I will need to create an instance of `HtmlWebpackPlugin` for each one of them. I load all three to the `plugins` array. I created a helper function, `createHtmlWebpackPluginFor(pageName)` to save a few lines of code in the config.

## Running Webpack

I can run webpack straight from the command prompt, but that's tedious. Instead, I'll create a script entry on `package.json` and give it an identifier:

package.json
```json
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.development.config.js"
  },
  ...
```

I named the script `build` as a convention for the intention is to generate html, JS, and CSS that are somewhat human-readable and will run on the browser. I then specify which webpack config file I want with the `--config` flag. Right now, there's only one, but later, I'll want a separate configuration for production.

Now, I run on the prompt `npm run build`.

## Examining The Generated Files

If there are no errors when I run `build`, Webpack will generate the 6 files onto the `/dist` folder. I'm going to peek inside one of the html files. I notice that there is now a `<script>` tag that references the JS file of the same file name as the referencing html file (plus the hash). Webpack created the JS files first, and `HtmlWebpackPlugin` inserted the script reference into the html file.

I know that my source JS files are empty, but the corresponding files outputted to `/dist` have a bunch of JS code that looks quite cryptic - surely not JS code a developer would typically write. It is not necessary to know exactly all the autogenerated code means and does. It's important to know that what I see there will run whatever code I have at development at the browser.

## Automatic Viewing The App On A Browser

It would be extremely helpful if we could see what our website or app looks like as we develop, and better yet, see the changes we make on any source file automatically reflect on the browser. This is absolutely possible with `webpack-dev-server`, so I'll go ahead and install it:

`npm i --save-dev webpack-dev-server`.

I'll specify some options onto my `webpack.development.config.js`. I'll add a few new properties:

webpack.development.config.js
```javascript
  { 
    ...
    watchOptions: {
      ignored: /node_modules/
    },
    ...
    devServer: {
      host: "localhost",
      port: 3000,
      open: true
    },
  }
```
The settings for `devServer` are pretty self-explanatory. However, `open: true` means that a browser will open, or a new tab will open (on an already-running browser). If `open` were set to `false`, the server would still be running in the background, but the developer would need to manually go to the browser and point it to `http://localhost:3000`.

Webpack already has built into it the capability to detect changes in source files, whether there is a new file created, an existing file deleted, or an existing file edited and then saved. When Webpack detects changes, it will automatically create any new files as necessary to the output (which is `/dist` in this project), and overwrite any existing file based on the edit made. The setup of the project right now doesn't have watching enabled, and so later, I'll enable it. But for now, I'll need to set `watchOptions`. I needed to specify `ignored` to the regular expression `/node_modules/`. For some reason, watch would watch every folder, which does take up system resources, so to save computing time and power, I'll ignore the very huge `node_modules` folder.

Finally, I'll need to add a new script called `serve` script in `package.json`:

```json
  "scripts": {
    ...
    "build": "webpack --config webpack.development.config.js",
    "serve": "webpack-dev-server --config webpack.development.config.js --watch"
  },
```

In general front-end development, the `build` script is typically run for developers to examine the generated files that the browser would read. However, the `serve` script means to run a local server and open up the browser so that the developer gets to see the result of writing code and markup. For `serve`, I call up `webpack-dev-server` instead of just `webpack` to see the project on a browser. I also specify the `--watch` flag so that I can make edits to existing source files and the server would automatically refresh the browser to reflect any changes I've made.

So, to see the website, I simply `npm run serve`.

One important and unobvious fact is that the `build` script will write files to the `/dist` folder. However, `serve` will NOT. They are indeed copies of the files but they wouldn't be written to disk. Instead, they'll remain in memory. This way, development will be quicker since we'll want to code a little and see the results on the browser as quickly as possible.

## Subsequent Builds

If we manually run `npm run build` several times, I see that the JS files from the previous builds remain, since I get new JS files with a different hash in the file names per build. I'll want to clear that `/dist` folder of the old files. I will need to install a plugin called `clean-webpack-plugin`:

`npm i --save-dev clean-webpack-plugin`.

Then, on my webpack config file, I'll need to incorporate `clean-webpack-plugin`:

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
...
  module.exports = {
    ...
    plugins: [
      ...
      new CleanWebpackPlugin(),
    ]
  }
```

I'll get a hold of the plugin above with `const { CleanWebpackPlugin } = require('clean-webpack-plugin');` Note that unlike most `require` function calls, `clean-webpack-plugin` will require me to pick the actual plugin `CleanWebpackPlugin` because there are many other available exports on `clean-webpack-plugin`. This is why I needed to include the curly braces. Then, I'll create a new instance of CleanWebpackPlugin and add it to the `plugins` array.

Now, when I run `npm run build` a few times, I'll always get a new set of JS files, each one having the new same hash for each new build.

This plugin also applies to the `serve` scenario where our files reside in memory. With `CleanWebpackPlugin()`, we would be, so to speak "garbage-collecting" the old JS files from older builds, thus keeping memory usage to a minimum.


