# UBCO Steel Bridge — Team Website

The website for the **UBCO Steel Bridge** engineering design team at UBC Okanagan — a student-run team that designs, fabricates, and competes a steel bridge at the Canadian National Steel Bridge Competition (CNSBC).

## Structure

- `index.html` — page markup
- `css/styles.css` — all styles
- `js/main.js` — interactions (hero slideshow, scroll animation, panel nav, contact form)
- `assets/img/` — sponsor logos, favicon, and hero background images
- `assets/team/` — team-member photos
- `assets/comp-photos/web/` — competition photos
- `vid-frames/` — CAD assembly-animation frames used by the scroll sequence

## Local preview

Open `index.html` in a browser, or serve the folder for a production-like setup:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

## Contact form

The contact form submits to [Formsubmit](https://formsubmit.co) and delivers to **ubcosteelbridge@gmail.com**. It needs a one-time activation: submit the form once, then click the confirmation link emailed to that address.
