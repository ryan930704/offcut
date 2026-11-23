# Offcut
Offcut turns a woodworking parts list into a linear cutting diagram. Open the shelf demo and switch between Best fit and List order to see six parts fit on three or four boards. Enter a custom stock length, kerf and parts list to plan another job. The numbers beneath each board give its cutting sequence.

## Run and deploy
From this directory run `npm run build` with Node.js. Open `dist/index.html` directly, or publish the contents of `dist/` on Cloudflare Pages. Set the Pages root to app, build command to npm run build and output directory to dist. The build uses Node's standard library. The browser works offline once the files are local.

## Technology and limits
Vanilla JavaScript, HTML and CSS. Lengths use integer tenths of a millimetre internally. Best fit decreasing places each part on the tightest available board. The comparison consumes stock sequentially in the listed order. Both charge one kerf per separation. Assumes usable straight stock, squared ends and equal board lengths. Accepts up to 200 pieces. The result is a feasible heuristic layout.

## Browser checks
With Chrome installed and the playwright npm package available, run npm run build then npm test. Alternatively set PLAYWRIGHT_MODULE to the path of an installed playwright-core package. The test operates the built page and saves three desktop screenshots in ../shots.

## Credits and AI disclosure
OpenAI Codex, an AI coding agent, wrote the code and copy under human direction. The diagrams use original HTML and CSS and the demo uses synthetic lengths. Playwright drives development tests. No runtime libraries, paid APIs, external images or fonts are required.

## License
MIT. See [LICENSE](../LICENSE).
