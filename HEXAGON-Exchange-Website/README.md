# HEXAGON Exchange Website

A lightweight responsive landing page built with HTML5, CSS3 and vanilla JavaScript.

## Files

- `index.html` — page structure/content
- `css/style.css` — design and responsive layout
- `js/script.js` — configuration, WhatsApp/email links, mobile menu and animations
- `assets/` — place your future images/logo here

## First thing to change

Open:

`js/script.js`

At the top, edit:

```js
const CONFIG = {
  businessName: "HEXAGON Exchange",
  whatsappNumber: "2348134600671",
  email: "osamudiamen025@gmail.com",
  tagline: "Fast. Simple. Reliable."
};
```

For WhatsApp, use the international number without `+`, spaces or brackets.

Example:
`2348012345678`

## Changing the honey color

Open:

`css/style.css`

At the top, edit:

```css
--primary-color: #F5A623;
--primary-dark: #D88A0A;
```

## Adding a service

In `index.html`, copy one `.service-card` inside `.service-grid` and change its title/description.

## Replacing the logo

The current logo is made with CSS so the site works without an image. When you have a real logo, you can replace the `.brand-mark` element with an `<img>` and put the logo in `assets/`.

## Notes

The WhatsApp and email links are generated from the configuration in JavaScript, so you only need to change your details in one place.
