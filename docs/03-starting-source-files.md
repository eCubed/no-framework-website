# Starting Source Files

My overall goal is to create and maintain source files - code, style, and markup, whose contents are only for me to see, and would later be packaged for a browser to render. Most importantly, the code and markup on the generated files will not be copies of what I wrote in my source files.

So, to start, I'll go ahead and create 3 html files under the folder `/src`, which is where I'll keep everything. I'll create `index.html`, `about.html`, and `contact.html`. I'll only show one and the other two are similar:

```html
<html>
  <head>
    <title>Index</title>
  </head>
  <body>
    <h1>Index Page</h1>
  </body>
</html>
```

Then, I'll create a JS file for each of those pages. Each of these JS files are going to be empty for now. I should now have empty `index.js`, `about.js`, and `contact.js`. They're empty because we're not concerned about JS right now. We're more concerned about later deploying.

When each of these html pages are going to be deployed, they each will script-reference their corresponding JS files. Notice that I didn't script-reference in the source code. Why? Because I will rely on a packaging tool to do that for me.

I'm going to be using Webpack - a configurable packaging tool that looks through source files and generates a bunch of files that are suredly browser-friendly.

## Automatic Viewing The App On A Browser

It would be extremely helpful if we could see what our website or app looks like as we develop, and better yet, see the changes we make on any source file automatically reflect on the browser. This is absolutely possible with `webpack-dev-server`, so I'll go ahead and install it:

`npm i --save-dev webpack-dev-server`.

I'll specify some options onto my `webpack.development.config.js`. I'll add a few new properties:

webpack.development.config.js
```javascript
  { 
    ...
    watch: true,
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
The settings for `devServer` are pretty self-explanatory. However, `open: true` means that a browser will open, or a new tab will open (on an already-running browser).

I set `watch` to true. When `watch` is true, Webpack will detect changes made to any of my source files whether it's code, CSS, or html, and it will overwrite any file that needs to be updated that was already in `/dist`. As a result, the browser will automatically refresh and reflect the changes I've made. For `watchOptions`, I needed to specify `ignored` to the regular expression `/node_modules/`. For some reason, watch would watch every folder, which does take up system resources, so to save computing time and power, I'll ignore the very huge `node_modules` folder.

Finally, I'll need to modify the `build:dev` script in `package.json`:

```json
  "scripts": {
    ...
    "build:dev": "webpack-dev-server --config webpack.development.config.js"
  },
```

I now call up `webpack-dev-server` instead of just `webpack`. Now, when I run `build:dev`, I'll get to see my app on a browser. If I change any one of my source files, for example, add a `<p>` tag in the html file I'm viewing, the browser would automatically reload and show the new paragraph I just entered.