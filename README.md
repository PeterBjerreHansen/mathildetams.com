# mathildetams.com

Mathilde Tams's portfolio. It is a plain static site: `index.html`, `style.css` and `site.js` build the pages from two content files, which she edits through **Pages CMS**, a free editing page.

| What | Where |
|---|---|
| Projects (title, year, text, image, cut-out or not, hidden or not) | `content/works.json` |
| Name, intro, About page, contact, how a project opens | `content/site.json` |
| Images | `media/` |
| Editing-page setup | `.pages.yml` |
| Domain for GitHub Pages | `CNAME`, created by GitHub when the domain is entered in step 3 |

**Repository:** [github.com/PeterBjerreHansen/mathildetams.com](https://github.com/PeterBjerreHansen/mathildetams.com). **Live site until the domain is connected:** [peterbjerrehansen.github.io/mathildetams.com](https://peterbjerrehansen.github.io/mathildetams.com/). Steps 1 and 2 below are done.

**Cost:** hosting on GitHub Pages and the Pages CMS editor are free. The only cost is the domain, about $10–11 a year for a .com at Cloudflare Registrar.

---

## Part 1: one-time setup (for you, about an hour)

### 1. Put the site on GitHub
1. Create a free account at [github.com](https://github.com).
2. Create a new **public** repository, for example `mathildetams.com`. Leave it empty (no README).
3. In this folder, run these commands, replacing `YOUR-USERNAME` with your GitHub username:

```bash
git init -b main
```

```bash
git add index.html style.css site.js content media .pages.yml .nojekyll README.md
```

```bash
git commit -m "Portfolio site with Pages CMS editing"
```

```bash
git remote add origin https://github.com/YOUR-USERNAME/mathildetams.com.git
```

```bash
git push -u origin main
```

### 2. Turn on GitHub Pages
1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**. Save.
3. After a minute the site is live at `https://YOUR-USERNAME.github.io/mathildetams.com/`. Check that it looks right there before you connect the domain.

### 3. Buy and connect mathildetams.com
1. Mathilde buys the domain herself, in her own name, so she owns it. [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) sells at cost (about $10–11 a year).
2. In Cloudflare, open the domain's **DNS** settings and add these records. Set each one to **DNS only** (grey cloud), not proxied:

| Type | Name | Content |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

3. Back in GitHub, **Settings → Pages → Custom domain**: enter `mathildetams.com` and save. GitHub adds a `CNAME` file to the repository for you. When the DNS check passes (minutes to a few hours), tick **Enforce HTTPS**.
4. On this Mac, run `git pull` in this folder afterwards, so the local copy has the new `CNAME` file and any edits made in Pages CMS.

### 4. Set up the editing page and invite Mathilde
1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with your GitHub account.
2. When asked, install the Pages CMS GitHub App and give it access to the `mathildetams.com` repository only.
3. Open the repository in Pages CMS. It reads `.pages.yml` and shows **Projects** and **Front page & About**.
4. Open the repository's **Collaborators** settings in Pages CMS and invite Mathilde by email. She does not need a GitHub account.

### 5. When something looks wrong
- Every save in the editor is a commit in the repository, so any change can be undone from GitHub's history.
- If the site does not update, check the **Actions** tab in GitHub: each save starts a short "pages build and deployment" run.
- To try the three ways a project can open, add `?styles` to the address, for example `https://mathildetams.com/?styles`. A small switch appears in the corner. Only that visitor sees it.

---

## Part 2: how Mathilde edits the site

Open the link in the invitation email and sign in. After that, go to [app.pagescms.org](https://app.pagescms.org) and open the site.

### Add a project
1. Open **Projects** and add a new item at the bottom of the list.
2. Fill in the title, year, type of work, who it was made for and the description. Leave an empty line between paragraphs.
3. Upload an image. Keep it under about 1 MB (around 2000 pixels on the longest side).
4. If the image is a cut-out with no background, tick **The image is a cut-out**.
5. Click **Save**. The site updates in a minute or two.

Projects appear on the site in the same order as in the list, and new projects slot into the layout by themselves.

### Change or remove a project
- Edit any field and click **Save**.
- To take a project off the site for a while, tick **Hide this project from the site**.
- To remove it for good, delete it from the list.

### Change the front page or About page
Open **Front page & About**. This holds her name, the short introduction, the About text and portrait, the lists under Practice and Selected, and the contact details. Here she can also choose **How a project opens**: Column, Unfold or Lift.

### Make a cut-out image
Cut-outs are PNG images with a transparent background.
- **On a Mac:** open the photo in Photos, right-click the subject and choose **Copy Subject**. Open Preview, choose **File → New from Clipboard**, then **File → Export** as PNG.
- **On an iPhone:** open the photo, touch and hold the subject until it lifts, then choose **Share** and save it.

Photos of a single object on a plain background work best. Any photo that is not a cut-out simply shows as a clean rectangle.

---

## Before the site goes public
- Replace the placeholder projects, texts and portrait. The current images are public-domain paintings from Wikimedia Commons, and their credits are in each project's **Image credit** field.
- Empty **Small note under the contact details** in **Front page & About** (it currently says "Draft · placeholder images and text").
- Check the email address under **Contact**. It is set to `hello@mathildetams.com`, which only works once an email address exists for the domain. Cloudflare's free Email Routing can forward it to her normal inbox.
