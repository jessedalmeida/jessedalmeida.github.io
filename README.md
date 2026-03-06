# Jesse d'Almeida — Personal Academic Website

Built with Jekyll for GitHub Pages. No build step needed — GitHub handles everything.

---

## 🚀 First-time setup

1. Create a GitHub repo named `yourusername.github.io`
2. Upload all these files (keep the folder structure intact)
3. Add your headshot as `assets/images/headshot.jpg`
4. Go to **Settings → Pages → Source: Deploy from branch → main / (root)**
5. Your site is live at `https://yourusername.github.io` in ~60 seconds

---

## ✏️ How to update content

### Add a new publication

**Option A — BibTeX tool (recommended):**
1. Go to your live site and open the "BibTeX → YAML Converter" in the Publications section
2. Paste your BibTeX entry and click Convert
3. Copy the YAML output
4. Open `_data/publications.yml` on GitHub, click the pencil icon to edit
5. Paste the entry at the top (most recent first)
6. Wrap your name in `**double asterisks**`: `**d'Almeida JF**`
7. Commit — site updates in ~30 seconds

**Option B — manual:**
Copy this template into `_data/publications.yml`:
```yaml
- key: yourkey2025
  year: "2025"
  title: "Your Paper Title Here"
  authors: "**d'Almeida JF**, Coauthor A, Coauthor B"
  venue: "Conference or Journal Name"
  status: published        # in_progress | under_review | accepted | published
  doi: "https://doi.org/10.xxxx/xxxxx"   # optional
  abstract: >              # optional — enables expandable card
    Your abstract text here.
  figure: "mypaper_fig.jpg"  # optional — place file in assets/images/
```

### Add a new research project

Edit `_data/projects.yml` and copy this template:
```yaml
- key: myproject
  title: "Project Title"
  period: "Jan 2025 – Present"
  tag: "Short Label · Year"
  status: active           # active | completed
  summary: >
    One or two sentence teaser shown on the card.
  abstract: >
    Longer description shown when the card is expanded.
  figure: "project_fig.jpg"  # optional
```

### Add a highlight (talk, award, news)

Edit `_data/highlights.yml` and copy this template:
```yaml
- key: myevent2025
  type: talk               # talk | award | grant | paper | outreach | news
  date: "2025"
  featured: false          # true = gold border (use sparingly)
  title: "Event or Award Title"
  body: >
    Description of the event, what you did, why it matters.
  location: "City, Country · Institution"
```

### Add a figure image

Drop any `.jpg` or `.png` file into `assets/images/` and reference it by filename in the data files.

### Update your personal info, links, or photo

Edit `_config.yml` — all your contact info and URLs live there.

---

## 📁 File structure

```
├── _config.yml          ← your info, links, settings
├── _data/
│   ├── publications.yml ← all publications
│   ├── projects.yml     ← research projects
│   └── highlights.yml   ← news, talks, awards
├── _includes/
│   ├── nav.html         ← navigation bar
│   └── footer.html      ← footer
├── _layouts/
│   └── default.html     ← page wrapper
├── assets/
│   ├── css/main.css     ← all styles
│   ├── js/main.js       ← interactivity + BibTeX parser
│   └── images/          ← drop photos here
│       └── headshot.jpg ← your photo
└── index.html           ← main page (layout only)
```

---

## 🔧 Running locally (optional)

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```
