# Starting Web Components

I have three pages. I want all of them to have the same navigation bar at the top. In old-school web development, I would have had to literally copy-paste the html for that navigation bar on the three pages. If I needed to update the navigation bar, I would have to update all 3 pages. That becomes a nightmare to have to manually update every instance of the navigation bar. 

One way to combat that issue is to create a single function that would build the DOM for the nav bar, and then reference that function on every page. This way, I only need to update in one place. That certainly is possible, even today, but nobody ever wanted to, and nobody today wants to build the DOM tree by scripting where it could be more easily done and maintained declaratively with html markup.

So, what is a web component? A web component is a collection of UI (existing html elements plus graphics if we wanted to) that we as developers can put together, and would eventually be used as a single markup tag just like the HTML elements we already use. In a web component, we can specify internal logic and we can also let it dispatch events that the containing page can listen for and handle.

I'll create a very simple reusable web component - the navigation bar. I will not go into too much detail about web components in general. I will only go over the setup and coding to make it possible. At the end, I'll be able to just plop its markup on the three html pages I have.

## Development Environment

I will create a folder underneath `src` called `components` where I'll save my web components. Inside `src/components` are going to be folders, each folder corresponding to one component. So, I'll create a folder called `nav-bar`. Why a folder and not immediately the TS file? Inside a component folder, I plan to create three files - one html, one scss, and one TS. This makes development much easier. For starters, I don't want to keep one long file that has the markup, the style, and the scripting logic in it because that requires lots of scrolling back-and-forth, and that slows down development! 

So, I'll have `nav-bar.html` which will contain:

```html
<nav>
  <div><a href="/">Home</a></div>
  <div><a href="/about.html">About</a></div>
  <div><a href="/contact.html">Contact</a></div>
</nav>
```
The only unusual thing about `nav-bar.html` is that it doesn't have the `<html>`, `<head>`, and `<body>` tags - only the tags I need to include in the component. Yes, these tags will be inserted on the containing page as we would expect.

Then, I have the following SCSS file, `nav-bar.scss`:

```css
@import '../../scss/variables';

nav {
  display: flex;
  justify-content: right;
  gap: #{2 *  $general-spacing};
  border-bottom: 2px white solid;  

  div {
    padding: $general-spacing;
  }  

  a {
    color: white;
    text-decoration: none;
    font-size: 150%;
    font-weight: bold;
  }
}
```
I'm now ready to create the web component class, but before that, I'll need to make some configuration changes.

## Preparing The Project For Web Components

On `tsconfig.json`, I'm going to set `"target": "es6"`, instead of `es5`. Yes, I'll lose support for older browsers, but I'll just say "Tough. Update your browser. Move on with the times!" Web Components require es6 support, and only the more modern browsers support Web Components.

On Webpack configuration, I'll go ahead and add a rule to recognize files whose extension is `.html`:

```javascript
  module: {
    ...
    rules: [
      ...
        {
          test: /\.html$/,
          loader: "html-loader"
        }
      ...
    ]
  }
```

I'll then need to `npm i --save-dev html-loader`. Why am I doing this? Later, I'll show that I don't have to include the full `HTML` on the TS file, but instead reference it somehow.

For the SASS rules, I used to have

```javascript
  module: {
    ...
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
    ]
  }
```

I'm going to change the test to `/styles.scss/`. This way, I pick out specifically ONLY `styles.scss` to output a corresponding file. I also have other SCSS files in `/src/components` that I do NOT want a separate output CSS file for, so, I'll create a separate rule for those SCSS files:

```javascript
  module: {
    ...
    rules: [
      {
        test: /components.*\.scss$/,
        use: [
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      },
    ]
  }
```
This will recognize ONLY the `.scss` files anywhere inside the `/components` folder. Notice the difference here from the `styles.scss` process. There is no `{ loader: MiniCssExtractPlugin.loader }`. That loader actually writes the file to deployment, and I don't want that. I simply want to get the final CSS string for use I'll discuss later.

## Creating The Web Component Class

Now that I've set up Webpack so I can develop Web Components as described above, I'm now ready to write my NavBar web component class:

```js

const scss = require('./nav-bar.scss');
const template = '<style>' + scss[0][1] + '</style>' + require('./nav-bar.html');

export class NavbarComponent extends HTMLElement {

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open'});
    shadow.innerHTML = template;    
  }
}
```

That's it, but there is a lot going on and I'll need to explain some concepts.

First, I'm going to explain the code above the class declaration. Because I've set up a rule in Webpack configuration to be able to pick out only the SCSS files in the `components` folder, I'm going to get an object from using the `Node` function `require(path)`. Here, I specify `./nav-bar.scss` which is relative to the TS file I'm working in. To get the CSS string I need, I'll need to reference `scss[0][1]`. I know that seems very hacky, but until there's a cleaner way to get the CSS string, I'll settle for this.

On the next line, I build what's called the **template** of the Web Component. The template is an HTML string *that can include* the `<style>` tag. In my case, yes, I would want to style the elements inside my web component, so I'll have a `<style>` tag that will include the CSS string from `require('./nav-bar.scss')`. After the style string, I append `require('./nav-bar.html')` which will get me exactly the HTML string found in the file `./nav-bar.html`.

Now, I'll move on to creating my web component class for the navigation bar.

First of all, I'll *always* choose to append `-Component` to the class name. This way, when I use it in later code, I'll know I'll be working with a custom web component as opposed to other classes. A custom web component will *always* need to inherit `HTMLElement`. I'll create my `constructor` and immediately call `super()` so that all necessary initializations of the parent class `HTMLElement` will happen first.

Now, I'll go over the two lines:

```javascript
  const shadow = this.attachShadow({ mode: 'open'});
  shadow.innerHTML = template;
```

With Web Components, there is this thing called the **Shadow DOM**. The Shadow DOM really is the root element of the web component. It is called "shadow" because it lives inside the component and is "protected". By "protected", I mean that no outside (the web component class) code can access the DOM children. Also, most often discussed about the Shadow DOM, global CSS does NOT affect the look of the elements in the shadow DOM, and any CSS specified inside the web component will apply ONLY to the shadow DOM.

We get a hold of a shadow by calling `this.attachShadow({ mode: 'open'});` We'll be required to write this line when we have a component with physical features such as the one I'm writing right now. The specification `{mode: 'open'}` is quite mysterious, because `closed` is also a valid value. Tutorials tell us to almost always specify `open` for the shadow.

Then finally, I set the shadow's `innerHTML` to the `template`, which includes the style tag as I've discussed earlier.

## Using The Custom Web Component

I'll be working in my `index.ts` and `index.html` files, and the same can be done for `about` and `contact` as well.

In my `index.ts` file, I'll add to the top of the file:

```js
import { NavbarComponent } from './components/nav-bar/nav-bar';

customElements.define('nav-bar', NavbarComponent);
```
Of course, I'll need to import my `NavbarComponent` from its TS file. Then, I'll need to register it to the browser with `customElements.define('nav-bar', NavbarComponent);`. The first argument is the name of the markup tag, `nav-bar`. Note that the name of the markup tag *is required* to have at least one hyphen in it! Then, the second argument is the my web component's class name, `NavbarComponent`.

Now, I'll head onto my `index.html` file and plop `<nav-bar>` above everything inside `<body>`:

```html
  <body>
    <nav-bar></nav-bar>
    <h1>Index Page</h1>
  </body>
```

When I run the app, I'll see that my `Navbar` will render its HTML. And as a reminder, the HTML I see here *is* my component's shadow DOM, which I can't pick out and style from outside my component!


