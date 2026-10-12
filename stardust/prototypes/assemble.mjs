// Assembles index-proposed.html from parts/*.html (chrome agent: header.html, footer.html;
// section agents: top.html, bottom.html). Re-run after editing any part.
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const part = (n) => { try { return fs.readFileSync(dir + 'parts/' + n, 'utf8'); } catch { return `<!-- parts/${n} not authored yet -->`; } };
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Push your ideas to the web | Netlify</title>
<meta name="description" content="Create with AI or code, deploy instantly on production infrastructure. One platform to build and ship.">
<link rel="icon" href="media/favicon.ico">
<link rel="preload" href="fonts/Figtree_wght_.DbGe-NNA.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/InstrumentSans_wdth_wght_.tWV223Ma.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="canon.css">
<link rel="stylesheet" href="chrome.css">
<link rel="stylesheet" href="top.css">
<link rel="stylesheet" href="bottom.css">
</head>
<body>
${part('header.html')}
<main id="main">
${part('top.html')}
${part('bottom.html')}
</main>
${part('footer.html')}
<script src="chrome.js" defer></script>
<script src="top.js" defer></script>
<script src="bottom.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(dir + 'index-proposed.html', html);
console.log('assembled index-proposed.html');
