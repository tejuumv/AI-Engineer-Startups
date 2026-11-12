# Startup AI Engineer Field Guide

A five-page website for learning applied AI engineering, shipping a portfolio project, and applying to startups. It adapts Mohit Sood’s 19-step AI Engineer Roadmap and adds an eight-week plan, project briefs, interview exercises, and an application tracker.

## Run locally

You’ll need Python 3 and a web browser with JavaScript enabled. The site uses plain HTML, CSS, and JavaScript.

1. Open Terminal and run the following commands.

   ```bash
   cd "/Users/tejasvimalvi/Desktop/Development/AI Engineer/startup-ai-field-guide"
   python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
   ```

2. Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/) in your browser.
3. Press **Ctrl+C** in Terminal when you want to stop the server.

## Pages

| Page | What to do there |
| --- | --- |
| [Overview](dist/index.html) | Find your next lesson and use the eight-week plan to choose a weekly deliverable. |
| [Roadmap](dist/roadmap.html) | Work through all 19 lessons and mark each one complete after you can do its practice exercise. |
| [Projects](dist/projects.html) | Choose a project and use the portfolio checklist to gather your demo, evaluation results, and user feedback. |
| [Applications](dist/applications.html) | Find startup roles, tailor the outreach template, and track application statuses and follow-up dates. |
| [Interview prep](dist/interview.html) | Practice six timed drills and rehearse a 90-second project walkthrough. |

If you already know Python, start by attempting the foundations exercises. Then pick a project and build one working workflow you can demo. Use its measured results and user feedback in your applications.

## Saved progress

Roadmap checkmarks, portfolio checkmarks, and application entries are stored in your browser. Use the same browser profile and local URL to keep accessing them. Clearing site data removes saved entries. The tracker records follow-up dates for reference.

## Edit the site

- [`dist/data.js`](dist/data.js) contains the roadmap, weekly plan, project briefs, and interview drills.
- [`dist/app.js`](dist/app.js) renders the pages and handles interactions and storage.
- [`dist/styles.css`](dist/styles.css) controls the layout and appearance.

Refresh the browser after editing a file.
