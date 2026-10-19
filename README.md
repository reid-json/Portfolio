# reid-json-portfolio

Portfolio site for <https://reid-json.net> built with Vue 3 + Vite.

## Editing content

- Name, bio, skills, links, and the project list: `src/data/site.js`
- Page layout/styling: `src/views/HomePage.vue`
- Shared palette, focus states, and typography: `src/assets/main.css`; navigation: `src/components/Navbar.vue`
- The design uses a fixed soft-slate light palette with teal accents and a darker featured-project panel. It does not switch automatically with the operating system theme.
- Projects can optionally include `name`, `category`, `highlights` (an array), and `featured: true`. The first featured entry appears in the hero; the first project is the fallback. App links and GitHub links remain editable in the same content file.

## Adding another web app

1. Put the app's static files in `public/apps/<name>/` (it needs an `index.html` and relative asset paths).
2. Add an entry to `projects` in `src/data/site.js` with `link: '/apps/<name>/index.html'`.
3. Commit and push.

The CCNA study site lives in `public/apps/ccna/` (standalone source: <https://github.com/reid-json/CCNA>).

## Vue/Vite template notes

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
