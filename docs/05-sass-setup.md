# SASS Setup

What Typescript is to JS, SASS is to CSS. We can think of SASS as "CSS on Steroids" because with SASS, we can do neat things like store variables and use their values in multiple places (which saves tons of time because changing the value will automaticall reflect everywhere it's referenced), automatically calculating colors and other values, and many other useful features. I won't get into too much detail on SASS, since the focus here is getting it setup properly with Webpack.

Webpack by itself doesn't know SASS and we want it to convert SASS to CSS that the browser understands. We will need to install quite a few **loaders** to perform the trick. A Webpack loader is a transformation applied to an input. We can think of it as a function in JS whose input is a file and whose output could be a new file (with new text) or some text stored in memory to be fed to another loader for another transformation.

To transform SASS to CSS, we will need to chain loaders in a specific order. Unfortunately, there isn't a single loader that will straight-up convert SASS to CSS. I'll forewarn right now that the setup may seem nonsensical, but the following is a loader chain that works.

## Developer Environment

In my development, I would like to store all of my SASS (.scss) files in one folder at, `/src/scss`. For the sake of simplicity, I will have a `styles.scss` file which I'll consider my "starting point". I'm going to create a `_variables.scss` file where I'll declare colors, spacing, etc. I'll also have a .scss file each for forms, the main navigation, and one for each specialized widget I could create. Right now, the exact .scss files to create for styling different parts of the website don't matter. What matters is, inside `styles.scss`, I'll import each .scss file. This way, I can tell Webpack to start processing SCSS at the file `/src/scss/styles.scss`. I'll trust Webpack to know how to crawl through the imports and generate the single CSS file for the browser.

## The SASS Loaders Lineup

I'm going to add a `module` property to the `module.exports` object. For `module`, I specify the an array called `rules`. A **rule** tells Webpack to look out for certain file extensions via a regular expression, and then apply the desired transformation for those files. Below, I'll show the SASS chain first before we'll install them.

```javascript
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          { loader: 'file-loader', options: { name: 'styles.css' } },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ],
  },
```

The `test: /\.(s*)css$/` looks out for .css or .scss files, and then apply the loaders (or transformations) as listed in the `use` array. Now, one very important thing to know is that loaders in Webpack are always listed in reverse order. So in our case, the `file-loader` is listed first, which means it happens last. This last step is the one that actually generates the final `styles.css` file. The last loader on the list is `sass-loader`, which is the first task. So, the first thing that happens in the SASS chain is to read the .scss file and load it in memory to be processed by other loaders later.

The next step is `postcss-loader` which automatically adds browser vendor prefixes for CSS properties that it finds that need prefixing. It also performs a few other transformations from the original source.

`css-loader` and `extract-loader` are a bit of a blur since their documentation definitions are quite similar. In these two steps, any `url(location)` from `background-image` found would convert the `location` (which is a dev location, typically a reference to a file in `/src/assets`) to the location relative to the the `/dist` for when everything is already deployed to the browser. Another important thing that happens is the `<link rel="stylesheet" href="">` will be inserted to the html files. Finally, the `file-loader` actally creates the .scss file with the file name specified in `options: { name: 'styles.css' }`.

So that Webpack knows to look for `styles.scss`, we'll need to add it to the `entry` object in the webpack configration file.

```javascript
  ...
  entry: {
    index: "./src/index.js",
    about: "./src/about.js",
    contact: "./src/contact.js",
    styles: "./src/scss/styles.scss"
  },
  ...
```

It might seem redundant to still have to put the .scss file in `entry` if `module.rules` seems to say "for every .css or .scss file you find, apply the following transformations". Actually, `module.rules` just describe what to do *when* Webpack encounters files with particlar file extensions. However, it is up to `entry` *to initiate* which files to process!

Finally, I'll install the npm packages for those loaders: 

`npm i --save-dev sass-loader postcss-loader css-loader extract-loader file-loader`.


