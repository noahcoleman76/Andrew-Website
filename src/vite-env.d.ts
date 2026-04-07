/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORIES_SHEET_URL?: string;
  readonly VITE_GALLERY_DRIVE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
