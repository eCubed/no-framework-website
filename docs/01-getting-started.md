## Getting Started

Before I get started, first and foremost, this app IS a Git Repository! So, I'll open up a terminal and prepare this app for git:

`git init`

I'll need to create `.gitnignore` so I now get to choose which folders (and their contents) won't make it to the repo:

```
dist
node_modules
```

`dist` will be the folder where I'll output my app. Auto-generated files should not make it to source control.
`node_modules` will be the folder where npm will install dependencies. This isn't code I write, and this folder is almost always at least tens of MB huge. So, I'll not include this to source control.

I go ahead and make the first commit, so I'll need to type the following in the terminal:

`git add .`
`git commit "Initial Commit"`