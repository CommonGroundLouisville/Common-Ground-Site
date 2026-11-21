# Common Ground website

Static site for Common Ground (coworking), Louisville Podcast Studio by Common Ground, and the Common Ground community. Hosted on Netlify, which deploys every push to `main`.

## Pages

- `index.html`: home page with three tiles (Cowork, Podcast, Community)
- `cowork.html`, `memberships.html`, `podcast.html`, `community.html`
- `site.css` and `site.js`: shared styles and animations used by every page

## Notes

- Launch: ourcommonground.co is the main domain; netlify.toml redirects the other domains and old Squarespace paths.
- `tools/build_site.py` is the generator the first version came from; the HTML files are now the source of truth and can be edited directly.
