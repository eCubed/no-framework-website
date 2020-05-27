# Creating Utilities

To keep the codebase more organized and easier to maintain, we may want to create utility classes that we may just want to call up on pages that need them. No, we do not want to have two or more copies of the same function in different places. That will be too tedious to maintain and if the function is long enough, it will add unnecessary size to our deployment.

I'm going to create a very trivial class called `EasyMath` that has only two functions: `add` and `multiply`. I'll create it under the folder `src/utils`:

easymath.ts
```js
export class EasyMath {
  public static add(a, b) {
    return a + b;
  }

  public static multiply(a, b) {
    return a * b;
  }
} 
```

I'm going to depend on it from both `about.ts` and `contact.ts`. I'll only `console.log()` the results because I want to later show a more important result than showing that the utility class is correct. If I run the app with `npm run serve`, I'll see the outputs I expect. So far, I have achieved being able to use the same code from multiple pages without having to write the functions many times.

Now, I'm going to build it with `npm run build`, and I'll examine the output of the JS files for `about` and `contact`. I noticed that the code I wrote for `easymath.ts` IS on both pages in full - not as the class that I wrote, but as ES6 JS as a string. If we keep on adding more utility functionality that we'll reference from many TS files, we'll end up with duplicate code strings. As a side note, our util functions are passed to the `eval()` function, which means sometime, whatever JS is in the string we pass *will* be run. I still want to get rid of the duplicate code, though, even if they're strings.

## Preparing for Common Chunks Optimization

It would be nice to output a separate JS for `easymath.ts` so that even at deployment (dev or prod), our utility code will only be outputted once and once only, not copied as strings in every output JS file that depends on it.

I'll make a small setting in the Webpack Configuration:

```javascript
  ...
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js',
    path: distFolder
  },
  ...
```
I add `chunkFilename` and just like the `filename` property, I formulate the name of the JS file that will contain the code shared by more than one JS file. When we are finished with our optimization efforts, Webpack will output a separate file for each dependency we specify from our project's entire code base, and there will not be any duplicate output JS files because Webpack already ensures that for us.

In Webpack, a **chunk** is common code broken apart from dependent scripts to ensure DRY at deployment. It is customary to append the chunk output with `.chunk.js` to indicate that it is a shared JS.

## Changing Code That Depends On A Utility Class

On my `about.ts`, for example, I used to have this code that uses my `EasyMath` utility class:

```javascript
import { EasyMath } from './utils/easymath';
console.log(`Calculate 3 + 5: ${EasyMath.add(3, 5)}`);
```

Unfortunately, Webpack (for now), doesn't know how to detect dependencies from `import` statements, so if I build the app, I'm not going to get my `easymath.{hash}.chunk.js` file. If I peek inside the outputted JS files, I'll still see my `EasyMath` code entirely put into a string.

In order for Webpack to detect the chunks I want, I'll need to change how I'll depend and use the utility:

```javascript
async function runEasyMathAsync() {
  
  const em = await import(/* webpackChunkName: "easymath" */'./utils/easymath');

  console.log(`Calculate 3 + 5: ${em.EasyMath.add(3, 5)}`);
}

runEasyMathAsync();
```
The most important line is `const em = await import(/* webpackChunkName: "easymath" */'./utils/easymath');`. I use the `import` function from `Node`, which takes in as a parameter the path to my utility class. However, the interesting bit is the comment `/* webpackChunkName: "easymath" */` inside the `import` function, right before the parameter value. Webpack looks for this "directive", if you will, and it's our way of telling `Webpack` to go ahead and separate out the code from the class into an output chunk JS file. In this case, I'm telling Webpack to prepare the output JS from my `EasyMath` class, with the filename containing the string `easymath`. Now, because I specified `chunkFileName` at the output to formulate the chunk file name, I'm going to get `easymath.{hash}.chunk.js` at the output.

Now, I needed to wrap an `async` function around `await import`, so, I'll need to call that `async` function to run my code. I could have also written `import(/* webpackChunkName: "easymath" */'./utils/easymath').then(...)`, but I chose not to in this example.

I'll do the same type of coding in my `contact.ts` file for Webpack chunking.

I'll go ahead and build my project and observe the contents of the output. I notice that Webpack *did* output for me the shared chunk `easymath.{hash}.chunk.js`. If I inspect the JS files `about.js` and `contact.js`, I no longer see the full JS string of my utility code. Instead, I see some cryptic-looking JS code that could be doing the work of loading the chunk JS as needed.

Now, I'll go and run this app on a browser with `npm run serve` and examine the network traffic. I didn't reference `EasyMath` from the `index.ts`, so the `EasyMath` chunk should not be called. I navigate to my About Page, and I notice that the `EasyMath` chunk JS has been requested. So, it's great to know that the chunk JS file would not be loaded to the browser until necessary.

I'll just make a small tweak in `contact.ts`:

```javascript
setTimeout(async () => {await runEasyMathAsync();}, 2000);
```

I'll wrap the function call with `setTimeout()` and I'll say I want the function to run 2 seconds after page load. If I load the page initially, I'll notice that my chunk isn't loaded. At the end of the two seconds, I'll notice that the browser finally made a request to get the chunk JS file, then the rest of the code executes. This is the power of chunk optimization with WebPack. The dependencies that reside in the chunk would not be loaded until it is absolutely necessary!
