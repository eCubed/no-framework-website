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