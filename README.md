# IBBJS
TypeScript/JavaScript version of The Impossible Bridge Book.

I deploy this on my [GitHub Pages](https://thomasoa.github.io/impossible/index.html) page.

You can see the original at [my bridge page.](https://bridge.thomasoandrews.com/impossible/) Ancient,
written to run on the server in Perl.

Now that there is an arbitrary precision integer class built into Javsscript,
it is easy to implement The Impossible Bridge Book entirely in the browser.

For personal education reasons, I am going to try to do the project in TypeScript and compile to Javascript. 

Working with npm, tsc, jest, and VSCode, on a Mac. Some of the npm tasks require Linux or Mac or other Unix-y
platform, because I couldn't get jest and tsc to agree about imports, so I wrote a gross perl hack.

To run, you will need `npm` installed.

   1. Clone the repository with the --recurse-submodules
   2. Run `npm install`
   3. Run `npm run build`
   4. Copy the contents of the `dest/` folder to a directory visible to a browser.
   5. Open `index.html` in a browser.
