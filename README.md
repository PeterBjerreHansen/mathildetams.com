# mathildetams.com

Mathilde Tams's portfolio site, with a simple editing page so she can add projects and change texts and images herself.

- **Live site:** [peterbjerrehansen.github.io/mathildetams.com](https://peterbjerrehansen.github.io/mathildetams.com/) (moves to mathildetams.com once the domain is connected)
- **Repository:** [github.com/PeterBjerreHansen/mathildetams.com](https://github.com/PeterBjerreHansen/mathildetams.com)
- **Editing page:** [app.pagescms.org](https://app.pagescms.org)

**Cost:** hosting on GitHub Pages and the Pages CMS editor are free. The only cost is the domain, about $10–11 a year for a .com at Cloudflare Registrar.

---

## How it fits together

```
Mathilde → Pages CMS (forms) → this GitHub repository → GitHub Pages → the website
```

1. **This repository is the storage.** It holds the design (`index.html`, `style.css`, `site.js`), the texts (two content files) and the images. Peter owns it.
2. **GitHub Pages is the website.** It publishes whatever is in the repository. When a file changes, the site updates within a minute or two.
3. **Pages CMS is the editing page.** It shows the content files as simple forms. When Mathilde clicks Save, Pages CMS writes the change into the repository, and GitHub Pages updates the site.

Mathilde never needs GitHub. She is invited to Pages CMS by email and only ever sees the forms. The editor works on the repository, not on the web address, so it can be used before the domain is connected.

| What | Where |
|---|---|
| Projects (title, year, text, image, cut-out or not, hidden or not) | `content/works.json` |
| Name, intro, About page, contact, how a project opens | `content/site.json` |
| Images | `media/` |
| Editing-page setup (which forms and fields Pages CMS shows) | `.pages.yml` |
| Domain for GitHub Pages | `CNAME`, created by GitHub when the domain is entered (step 2 below) |

---

## Status

- [x] Site built and pushed to this repository
- [x] GitHub Pages switched on (branch `main`, folder `/`), site live at the github.io address
- [ ] Editing page set up and Mathilde invited (step 1 below; can be done now)
- [ ] Domain bought and connected (step 2 below; whenever she has bought it)
- [ ] Placeholder content replaced (see "Before the site goes public" at the end)

---

## Part 1: what's left to set up (for Peter)

### 1. Set up the editing page and invite Mathilde (about 10 minutes, can be done now)
1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with the GitHub account `PeterBjerreHansen`.
2. When asked, install the Pages CMS GitHub App and give it access to the `mathildetams.com` repository only.
3. Open the repository in Pages CMS. It reads `.pages.yml` and shows **Projects** and **Front page & About**.
4. Open the repository's **Collaborators** settings in Pages CMS and invite Mathilde by email. She does not need a GitHub account.

### 2. Buy and connect mathildetams.com (when she is ready)
1. Mathilde buys the domain herself, in her own name, so she owns it. [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) sells at cost (about $10–11 a year).
2. In Cloudflare, open the domain's **DNS** settings and add these records. Set each one to **DNS only** (grey cloud), not proxied:

| Type | Name | Content |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | peterbjerrehansen.github.io |

3. In GitHub, open [Settings → Pages](https://github.com/PeterBjerreHansen/mathildetams.com/settings/pages), enter `mathildetams.com` as the **Custom domain** and save. GitHub adds a `CNAME` file to the repository for you. When the DNS check passes (minutes to a few hours), tick **Enforce HTTPS**.

### 3. Working on the code yourself
- Mathilde's saves go into the repository on GitHub, not into the copy on your Mac. Before changing the design, run `git pull` in `~/Desktop/projects/coding_projects/on_github/mathildetams.com` so you start from her latest content.
- Stage files by name (`git add style.css`), then commit and push. GitHub Pages republishes automatically.

### 4. When something looks wrong
- Every save in the editor is a commit in the repository, so any change can be undone from GitHub's history.
- If the site does not update, check the **Actions** tab in GitHub: each save starts a short "pages build and deployment" run.
- To try the three ways a project can open, add `?styles` to the address, for example [peterbjerrehansen.github.io/mathildetams.com/?styles](https://peterbjerrehansen.github.io/mathildetams.com/?styles). A small switch appears in the corner. Only that visitor sees it.

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
