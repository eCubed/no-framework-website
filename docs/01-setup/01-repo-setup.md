# Getting Started

## Git Setup
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
`git commit -m "Initial Commit"`

I'll now log into my Github account and create my new repository. Once that's complete, I'll now go back to my prompt (opened to the root of my project's folder), and type the following:

`git remote add origin https://github.com/eCubed/no-framework-website.git`

This tells git where on Github to save the repository.

Then finally, I run

`git push -u origin master`

to actually save my work to Github. I'm not going to discuss the -u flag, and why origin and master at this time, since those are beyond the scope of creating this TS library.

Now, pushing to a repo on Github, under a Github account requires security, so if I'm not logged in, there will be a window that pops up asking for my username and password. Once I type in the right credentials, then the `git push` will proceed. 

For me, personally, I would like to proceed managing my source control using a 3rd party software since it's a lot easier to perform committing, making branches, merging, etc. in it than at a command prompt. I use GitKraken once I've created and pushed the repo to GitHub.


