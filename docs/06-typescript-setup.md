# Typescript Setup

So far, we have worked with JS files in our source code. It is now time to migrate to Typescript. In short, Typescript is a programming language with many OOP features like classes, interfaces, and inheritance, however it still gives the user some loose typing flexibility that JS allows. Since Typescript allows us to create classes like we do in C# or Java, it becomes easy to modularize code and import everywhere without worrying whether code has already been imported down several dependency graphs. Typescript also gives the developer a big help with code completion in many editors so that the developer will no longer need to go back and forth between files to find out whether something is or isn't a property of some object.

## Installation

Webpack doesn't know how to interpret Typescript, so, we will need to install it with `npm`:

`npm i --save-dev typescript ts-loader`

I need to install `typescript` itself, and for Webpack to be able to recognize it and convert it to JS, I also needed to install `ts-loader`.

## Configuration

Since we will be writing Typescript files, Webpack will be reading them instead of JS files. So, in the `entry` property of our Webpack config file, we first change `.js` to `.ts`:

```javascript
  module.exports = {
    ...
    entry: {
      index: "./src/index.ts",
      about: "./src/about.ts",
      contact: "./src/contact.ts"
    },
    ...
  }
```

I then add a rule to let Webpack know how to handle a TS file when it encounters one:

```javascript
  module.exports = {
    ...
    module: {
      rules: [
        ...
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        }
        ...
      ]
    }
    ...
  }
```

## Conversion of JS Files to TS Files

Since I don't have much code in the 3 JS files I have, I simply rename the file, changing the extension from `.js` to `.ts`, so I'll go ahead and do that. Any JS code in a TS file is still considered valid Typescript, since it is said that Typescript "is a superscript" of JavaScript.

Now, I build the app and examine briefly the contents of the `/dist` folder. Right now, they output is the same as when we had JS files. The only difference is that henceforth, I can develop in Typescript which makes development a lot easier with dependencies on many TS files without the headache and worry of trying to avoid duplicate declarations, that we can program in a more OOP fashion, etc.

## Next Steps

I have just begun putting together a very basic website using TS and SASS to code, and using Webpack to put it together for the browser to render. There are a ton left that I would need to do. The following is a listing of what I plan to do to enhance this development:

1. **Image Optimization**. It is common for websites to store a few images - usually background images used in CSS and a few smaller images used in `<img>` tags placed statically on html pages. There are loaders and plugins that we can process images to be the smallest file size possible without losing quality once they're outputted to `/dist`. We will want to optimize images because images typically take up about at least half of the total size of the deployed package!

2. **Production Build**. Once I'm ready to share this site with the world, I will create a separate configuration for the production build. At this time, the contents of `/dist` can be run on the browser, however, they are NOT optimized. When CSS is optimized, a lot of the extra white spaces are gone (like newlines and tabs), so it looks all packed together in one line, making it very hard to read. When JS is optimized, all of the meaningfully-named variables and functions are renamed to extremely short and senseless names as well as all the extra white spaces are gone. So, optimized (uglified, as it's often called) JS is very difficult to read (which helps hide the logic from visitors), but it still works as expected!

3. **Testing**. I am familiar with unit testing for business logic at the back end. I don't know anything about testing when it involves the UI. Personally, I put very little priority on front-end testing, so I might not even get to testing.

4. **Vendors**. What if I want to include jQuery, moment, or any other library to this system? It would be very easy to import (or depend on) them from TS code. However, I think I'd like to put 3rd party code on a separate JS file at deployment. No, I wouldn't want to duplicate huge vendor codes in multiple JS files in the output. There is a way to do this. I will definitely look into it.

5. **Organize SCSS per Industry Best Practices**. I've seen some sort of best practice across projects (even of different platforms and frameworks) of how to organize SCSS. I might want to do this, but that's beyond the scope of this project. Well, I might just "do it" but will not include it in the standard documentation for this project.

6. **Section on Attempt To Pull Some Framework Features**. I just realized that this entire project isn't just the effort of how to set up Webpack to deploy a website from an environment that is easy for the developer. It's about trying to build a website without frameworks (or libraries like React), which, since it's 2020, requires modern features and modern looks that are easy to pull in a framework but may be difficult in vanilla JS! One of the features I heavily rely on from frameworks is the ability to reflect live variable values on the page by merely changing the values in code. In plain JS, we would have to hunt down the element we earlier prepared and explicity set its `innerText` or `innerHtml` value. This becomes extremely tedious because we'd have to "chase-and-set" the element in all places in our code that changes the value of that variable. Then, it becomes a very daunting task to do this for every single variable. Another favorite feature of mine, this time, from Angular specifically, is services and DI. I don't know off the top of my head if I can even start to think to pull those off in vanilla JS. But maybe that's later!





