import {
  getStoryImageFallbackUrls,
  normalizeStoryImageUrl,
} from "./storyMemories";

export interface GalleryImage {
  name?: string;
  url: string;
}

interface GalleryImageApiRow {
  id?: string;
  name?: string;
  url?: string;
}

export const GALLERY_DRIVE_FOLDER_ID =
  "18ewdvvPm571qvdcv41NiTmEDcYjra-ZYFqcH7OBs_ix36zIU0kql-t8PLnCWvnwwIScXugpF";

const buildGalleryEndpoint = () => {
  const endpoint =
    import.meta.env.VITE_GALLERY_DRIVE_URL ??
    import.meta.env.VITE_STORIES_SHEET_URL;

  if (!endpoint) {
    return null;
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}galleryFolderId=${encodeURIComponent(
    GALLERY_DRIVE_FOLDER_ID
  )}`;
};

export const getGalleryImageFallbackUrls = (value: string) =>
  getStoryImageFallbackUrls(value);

export const fetchGalleryImages = async () => {
  const endpoint = buildGalleryEndpoint();

  if (!endpoint) {
    return [];
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Gallery request failed with ${response.status}`);
  }

  const data = (await response.json()) as GalleryImageApiRow[];

  return data
    .map((row) => {
      const url =
        row.url ??
        (row.id
          ? `https://drive.google.com/thumbnail?id=${row.id}&sz=w2000`
          : "");

      const normalizedUrl = normalizeStoryImageUrl(url);

      if (!normalizedUrl) {
        return null;
      }

      return {
        ...(row.name ? { name: row.name } : {}),
        url: normalizedUrl,
      };
    })
    .filter((image): image is GalleryImage => image !== null);
};
