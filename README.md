# UBCO Steel Bridge — Team Website

The website for the **UBCO Steel Bridge** engineering design team at UBC Okanagan — a student-run team that designs, fabricates, and competes a steel bridge at the Canadian National Steel Bridge Competition (CNSBC).

## Structure

- `ubco_steelbridge_v17.html` — the site (single self-contained page)
- `assets/comp-photos/web/` — web-optimized competition photos
- `vid-frames/` — CAD assembly-animation frames used by the scroll sequence
- `*-logo.png` / `*-logo.jpg` — sponsor logos
- `favicon.png` — site icon

## Local preview

Open `ubco_steelbridge_v17.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000/ubco_steelbridge_v17.html
```

## Contact form

The contact form submits to [Formsubmit](https://formsubmit.co) and delivers to **ubcosteelbridge@gmail.com**. It needs a one-time activation: submit the form once, then click the confirmation link emailed to that address.
