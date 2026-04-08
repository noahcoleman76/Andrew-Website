# React + TypeScript + Vite

## GitHub Pages Classic Deploy

This repo is set up for the classic GitHub Pages flow, not GitHub Actions.

1. Run `npm run build:docs`.
2. Commit the updated `docs/` folder.
3. Push to GitHub.
4. In GitHub, open `Settings -> Pages`.
5. Set `Source` to `Deploy from a branch`.
6. Set the branch to `main` and the folder to `/docs`.
7. Set `Custom domain` to `keepgoingforandrew.com`.
8. Save.

The `docs/CNAME` file keeps the custom domain configured for GitHub Pages.

## Stories Google Sheet Setup

The Stories page can load memories from a Google Sheet through a deployed Google Apps Script.

1. Create a Google Sheet with these exact headers in row 1 on the stories tab:
   `Timestamp`, `Your Name`, `A message for Andrew`, `Upload Photos`
2. Add a second tab named `Family Messages` with these exact headers in row 1:
   `Timestamp`, `Name`, `Email`, `Message`
3. In that sheet, open `Extensions -> Apps Script`.
4. Replace the default script with this:

```js
const FAMILY_MESSAGES_SHEET_NAME = "Family Messages";

function doGet(e) {
  const imageId = (e && e.parameter && e.parameter.imageId) || "";
  const galleryFolderId =
    (e && e.parameter && e.parameter.galleryFolderId) || "";
  const sheetName = (e && e.parameter && e.parameter.sheet) || "";

  if (imageId) {
    const file = DriveApp.getFileById(imageId);
    return file.getBlob();
  }

  if (galleryFolderId) {
    const folder = DriveApp.getFolderById(galleryFolderId);
    const files = folder.getFiles();
    const images = [];

    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();

      if (!mimeType.startsWith("image/")) {
        continue;
      }

      const id = file.getId();
      images.push({
        id,
        name: file.getName(),
        url: `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify(images))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (sheetName === FAMILY_MESSAGES_SHEET_NAME) {
    return getFamilyMessages();
  }

  return getStories();
}

function doPost(e) {
  const sheetName = (e && e.parameter && e.parameter.sheet) || "";

  if (sheetName !== FAMILY_MESSAGES_SHEET_NAME) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Unsupported sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(FAMILY_MESSAGES_SHEET_NAME);

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Family Messages sheet missing" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    (e.parameter.name || "").trim(),
    (e.parameter.email || "").trim(),
    (e.parameter.message || "").trim(),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getStories() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();

  const getColumn = (name) => headers.indexOf(name);
  const timestampIndex = getColumn("Timestamp");
  const nameIndex = getColumn("Your Name");
  const messageIndex = getColumn("A message for Andrew");
  const photosIndex = getColumn("Upload Photos");

  const toDirectImageUrl = (value) => {
    const text = String(value || "").trim();
    if (!text) return null;

    const match =
      text.match(/id=([a-zA-Z0-9_-]+)/) ||
      text.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (!match) return text;

    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2000`;
  };

  const splitPhotos = (value) =>
    String(value || "")
      .split(/[\n,]/)
      .map((item) => toDirectImageUrl(item))
      .filter(Boolean);

  const data = rows
    .filter((row) => row[nameIndex] && row[messageIndex])
    .map((row) => ({
      date: row[timestampIndex],
      name: row[nameIndex],
      message: row[messageIndex],
      photos: splitPhotos(row[photosIndex]),
    }));

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getFamilyMessages() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(FAMILY_MESSAGES_SHEET_NAME);

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();

  const getColumn = (name) => headers.indexOf(name);
  const timestampIndex = getColumn("Timestamp");
  const nameIndex = getColumn("Name");
  const emailIndex = getColumn("Email");
  const messageIndex = getColumn("Message");

  const data = rows
    .filter((row) => row[nameIndex] && row[messageIndex])
    .map((row) => ({
      date: row[timestampIndex],
      name: row[nameIndex],
      email: row[emailIndex],
      message: row[messageIndex],
    }));

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5. Click `Deploy -> New deployment`.
6. Choose `Web app`.
7. Set `Who has access` to `Anyone`.
8. Copy the deployed `/exec` URL.
9. Create a local `.env.local` file from [`.env.example`](/Users/noahcoleman/Desktop/CODEV/CODEV%20Sites/Andrew%20Website/.env.example).
10. Set `VITE_STORIES_SHEET_URL` to that `/exec` URL.
11. Restart the dev server or rebuild the site.

If the sheet URL is missing or the request fails, the page falls back to the existing local `memories.ts` data.

If the gallery returns a `DriveApp.getFolderById` permissions error, the Apps
Script deployment needs Drive authorization:

1. In Apps Script, open `Project Settings`.
2. Enable `Show "appsscript.json" manifest file in editor`.
3. Add `https://www.googleapis.com/auth/drive.readonly` to `oauthScopes`.
4. Run a helper function that calls `DriveApp.getFolderById(...)` once from the
   Apps Script editor and approve the requested permissions.
5. Redeploy the web app as a new version with `Execute as` set to `Me`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
