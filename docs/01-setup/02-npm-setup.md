# Npm Setup

I will need to install npm packages, and I'll need to save what I installed so that I will be able to run this project when it is cloned to a different machine.

I start with initializing npm with `npm init`. I go through the prompts and answer the questions the best I can. After I'm done, npm generates `package.json` for me.

```json
{
  "name": "no-framework-website",
  "version": "1.0.0",
  "description": "Attempt to create a modern website with no frameworks",
  "main": "dist/index.js",
  "directories": {
    "doc": "docs"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/eCubed/no-framework-website.git"
  },
  "keywords": [
    "lab"
  ],
  "author": "Israel D. Fernando",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/eCubed/no-framework-website/issues"
  },
  "homepage": "https://github.com/eCubed/no-framework-website#readme"
}
```

I will both manually edit this file and have npm automatically make changes to it throughout the course of the development of this website.