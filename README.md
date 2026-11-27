# Translation Practice Assistant

A lightweight, static English-to-Vietnamese practice app. Work through eight practical translation drills based on the translation-practice handbook, compare your answer with a Vietnamese reference, and self-rate each phrase. This is reflective practice—not automatic or AI grading.

## Run locally

Open `index.html` in a browser, or serve the repository root:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`. The app has no build step, backend, API, or secrets. Mastered phrases are saved in this browser's local storage.

## Deploy

GitHub Actions publishes the static files to GitHub Pages when the deployment branch is updated. The workflow copies only `index.html`, `styles.css`, and `app.js` into the Pages artifact.

## Content and feedback

The exercises are based on the five handbook sections in the root directory. Reference answers are example translations; learners can choose **I got it** or **Practice again** after comparing their work. Different translations may also be correct.
