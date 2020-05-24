# SASS Setup

What Typescript is to JS, SASS is to CSS. We can think of SASS as "CSS on Steroids" because with SASS, we can do neat things like store variables and use their values in multiple places (which saves tons of time because changing the value will automatically reflect everywhere it's referenced), automatically calculating colors and other values, and many other useful features. I won't get into too much detail on SASS, since the focus here is getting it setup properly with Webpack.

Webpack by itself doesn't know SASS and we want it to convert SASS to CSS that the browser understands. We will need to install quite a few **loaders** to perform the trick. A Webpack loader is a transformation applied to an input. We can think of it as a function in JS whose input is a file and whose output could be a new file (with new text) or some text stored in memory to be fed to another loader for another transformation.

To transform SASS to CSS, we will need to chain loaders in a specific order. Unfortunately, there isn't a single loader that will straight-up convert SASS to CSS.

## Developer Environment

In my development, I would like to store all of my SASS (.scss) files in one folder at, `/src/scss`. For the sake of simplicity, I will have a `styles.scss` file which I'll consider my "starting point". I'm going to create a `_variables.scss` file where I'll declare colors, spacing, etc. I'll also have a .scss file each for forms, the main navigation, and one for each specialized widget I could create. Right now, the exact .scss files to create for styling different parts of the website don't matter. What matters is, inside `styles.scss`, I'll import each .scss file. This way, I can tell Webpack to start processing SCSS at the file `/src/scss/styles.scss`. I'll trust Webpack to know how to crawl through the imports and generate the single CSS file for the browser.

## The SASS Loaders Lineup

I'm going to add a `module` property to the `module.exports` object. For `module`, I specify the an array called `rules`. A **rule** tells Webpack to look out for certain file extensions via a regular expression, and then apply the desired transformation for those files. Below, I'll show the SASS chain first before we'll install them.

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  ...
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ],
    ...
    plugins: [
      new MiniCssExtractPlugin({
        filename: `styles.[hash].css`
      })
    ]
  },
```

The `test: /\.(s*)css$/` looks out for .css or .scss files, and then apply the loaders (or transformations) as listed in the `use` array. Now, one very important thing to know is that loaders in Webpack are always listed in reverse order. So in our case, the `MiniCssExtractPlugin.loader` is listed first, which means it happens last. This last step is the one that actually generates the final `styles.css` file. The last loader on the list is `sass-loader`, which is the first task. So, the first thing that happens in the SASS chain is to read the .scss file, convert it to CSS, and load it in memory to be processed by other loaders later.

The next step is `postcss-loader` which automatically adds browser vendor prefixes for CSS properties that it finds that need prefixing. It also performs a few other transformations from the original source.

`css-loader` is said to "resolve" all of the `url(location)`s that it sees from the SASS that we originally wrote. Usually, that `location` is a path of an image, and that path is *relative to the location of whatever SASS file it was declared*. In a front-end project (regardless of platform), it is a common convention to put images and other media in the `/assets` folder off project root. While the developer is writing any one of the SASS files and they need to specify a background image to some element, they can write a path that points to an image in the assets folder. Typically, depending on how deep that SASS file is in the system, we see properties like `background-image: url('../../../assets/skybkg.jpg');` That path will pick out the right image from the developer's perspective, but that is NOT going to be the path to that image when it runs on the browser! The job of `css-loader` is to convert that developer path to the actual path *relative to the outputted .CSS file*.

Now we get to the final step - `MiniCssExtractPlugin.loader`. This plugin's responsibility is to first define the filename of the SINGLE CSS file we'll want to output, finally write that file, and insert a `<link rel="stylesheet" href="...">` on every html page. I specify the filename for that final CSS to be `styles.[hash].css`. That `[hash]` will be different for each build to ensure that the browser will always get the freshest files to render (thus, preventing caching), as with the JS files.

Finally, I'll install the npm packages for those loaders: 

`npm i --save-dev node-sass sass-loader postcss-loader autoprefixer css-loader mini-css-extract-plugin`.

## Fixing the JS Files For SASS/CSS Integration

If I build the app now, I'll see that Webpack did indeed output my `styles.[hash].css` file, and its contents are exactly as I expected. However, the html files didn't have the `<link>` tags that would have pointed to the stylesheet, though I've set up `MiniCssExtractPlugin` into my SASS loaders lineup. So, it seems like Webpack has no knowledge that the file `./src/scss/styles.scss` even exists. To cure that, I will go ahead and go into my JS files - just the ones correlated with the html files, and add the line `import './scss/styles.scss';` where the path to the `.scss` file is relative to the JS file it's in. Since those JS files are specified in the `entry` property of the configuration, anything `import`ed in those files will "be brought to Webpack's attention." Now, Webpack knows that our SASS file exists. Then only can Webpack run the loader lineup that will perform the big job that starts with converting the SASS to CSS, all the way to actually generating the CSS file, and most conveniently, insert the correct `<link>` tag for it in every html file!


