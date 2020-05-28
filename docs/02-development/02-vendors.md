# Vendors

Sometimes, we would like to use a library we find on npm so that we don't have to write everything from scratch. It's easy to install and develop with it from our `.ts` files. When we deploy our app (build or prod), we surely will see the effects of that library, as well as that library's code would also be deployed because our code depends on it. However, if we're not careful, it is possible to reference a library (via `import` statements) on multiple TS files, and as we've seen before, there will be many copies of that library's code in many outputted JS files.

Thankfully, with Webpack, there is a cure for that problem. The goal is, we will want to output a `vendors.chunk.js` file where all of the packages we've installed and depend on will end up in our deployment. As Typescript goes through our code base and finds references to vendor packages, it will know to only keep one copy. At deployment, the `vendors.chunk.js` file will only be loaded by the browser when needed.

## Setup

The only setup required is adding another property to Webpack configuration:

```javascript
  module.exports = {
    ...
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            test: /node_modules/,
            enforce: true
          },
        }
      }
    },
    ...
  }
```
I'm not going to explain all of the properties. The most important ones are `name` and `test` for our purposes. The name, which I set to `vendor` will end in deploying the file `vendor.{hash}.chunk.js` in deployment, as I've previously set `output.chunkFileName` to `[name].[hash].chunk.js`. The `test` is to check the parent folder from where the library is stored. Setting it to the regular expression `/node_modules/` means pick out only the packages in the `/node_modules` folder, where vendor packages would be installed. We need to keep in mind that Webpack won't output everything inside `/node_modules` to our project - just the ones in `/node_modules` *that are ever referenced* from our code base.

# Installing Vendor Modules

For the sake of demonstration, I will install `moment`:

`npm i --save moment`

I use `--save` instead of `--save-dev` because `moment` is a library that I'll actually reference from my base code. `--save-dev` is for installing development tools, plugins, etc., like those I needed to install to allow Webpack to do specific things like work with SASS.

I'll go to one of my TS files and depend on moment.

```javascript
import * as moment from 'moment';
console.log(`Today, per Moment is: ${moment().format('dddd, MMM DD, yyyy')}`);
```

If I run my app, I'll see the expected output on my console.

Now, I'll try to build it to see what gets outputted. I now see a file called `vendor.{hash}.chunk.js`. If I look inside it, I see the code for it.