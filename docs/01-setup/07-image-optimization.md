# Image Optimization

When we develop and reference images in our source files, we often want to point to a location relative to our development environment. However, we want to also copy those images to deployment, but not only copy - also optimize them for the web. To optimize images for the web means to reduce the file size as small as possible without sacrificing or sacrificing the smallest amount of image quality. It IS possible to achieve all of this with Webpack, however, we'll need to install a loader - `image-webpack-loader` and add a few settings to our configuration file.

First, the install:

`npm i --save-dev image-webpack-loader`

I'll need to add a rule to the `module rules` array in my configuration file:

```javascript
  ...
  module: {
    rules: [
      ...
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          { loader: 'file-loader', options: { name: 'images/[name].[ext]' } },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                  progressive: true,
                  quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              }
            }
          }
        ]
      }
      ...
    ]
  }
```

This is to tell Webpack what to do when it encounters .png, .jpg, .jpeg, .gif, and .svg, per the `test` regular expression. Now, we have the list of loaders, and we remember that loaders are listed in reverse order. The `image-webpack-loader` runs first, according to the options given above. I won't get into the details of each `image-webpack-loader` setting. These are values copied from an online source and could be tweaked later. For now, I'll settle with the values above. Then, we let `file-loader` take the output of `image-webpack-loader`, which is bytes, and write the file to the specified path at deployment (which is `/dist` if we run the build script).

Now, it is also important to remember that Webpack doesn't actually scour our entire project for all of the image files that we might have kept in our development folders and copy all of them to the deployment. Since we reference images from stylesheets with the `url(location)`, and we reference the stylesheet via the `import` statement at the top of our TS files, Webpack will encounter each `url(location)` reference and run each image it finds through the optimization and file loading steps. Only the images found referenced in the stylesheets will be copied to deployment.

