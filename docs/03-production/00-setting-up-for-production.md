# Setting Up For Production

Right now, I am pretty satisfied with my app. Everything works. Everything looks great. I get a working production build when I run `npm run build`. Now, I want to build for production. The package put together for the development build works, but it is not optimized. The file sizes are larger for the scripts because of all the extra white space, full variable and function names, and comments. I'll need to create settings that will deploy project to production. I expect that the file sizes, especially the JS and CSS files should be magnitudes smaller in production than in development.

I'll go ahead and create a file called `webpack.production.config.js`. To make things easier, I will simply copy the contents of `webpack.development.config.js` and make the following changes:

I'll set `mode` to `"production"`. This will automatically minify and uglify the JS, CSS, and even the HTML.
I'll also get rid of the `[hash]` so that I'll get cleaner-looking filenames outputted.

That's all I'll need to change in the configuration file for a simple production deployment.

Now, I'll go over to `package.json` and add a script I'll call `prod`:

```json
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.development.config.js",
    "prod": "webpack --config webpack.production.config.js",
    "serve": "webpack-dev-server --config webpack.development.config.js --watch"
  },
  ...
```

The `prod` script is essentially the same as the build script, except that I call up `webpack.production.config.js` instead of `webpack.development.config.js`.

I'll now go to my prompt and type `npm run prod`. If I open the JS files, I'll see that everything has been put in one line. All of the variable names have been shortened to nonsensical names, and all the white spaces (except those inside strings) are removed. The same kind of minification and uglification happens with the HTML and CSS files.

I did a total size comparison between the development and production builds. The production build totalled 1.05 MB and the dev totalled 1.08 MB. One thing to consider is that I did have that one large image. I'll compare sizes again without the image. Dev is 47.3KB. Prod is 12.6KB. That's a 3.75x total file reduction, which is a big help, especially as our app grows larger. Since the prod build is smaller, it's better for our users because our app will load faster on their browsers, and will save everybody bandwidth.