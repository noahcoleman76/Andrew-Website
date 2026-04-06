export interface StoryMemory {
  name: string;
  date: string;
  message: string;
  imageUrls: string[];
  imageFolder?: string;
}

interface StoryMemoryApiRow {
  name?: string;
  message?: string;
  date?: string;
  photos?: string[];
}

const getGoogleDriveFileId = (value: string) => {
  const text = String(value || "").trim();

  if (!text) {
    return null;
  }

  const match =
    text.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    text.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    text.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);

  return match?.[1] ?? null;
};

const buildStoryImageProxyUrl = (fileId: string) => {
  const endpoint = import.meta.env.VITE_STORIES_SHEET_URL;

  if (!endpoint) {
    return null;
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}imageId=${encodeURIComponent(fileId)}`;
};

export const normalizeStoryImageUrl = (value: string) => {
  const text = String(value || "").trim();

  if (!text) {
    return null;
  }

  const fileId = getGoogleDriveFileId(text);

  if (!fileId) {
    return text;
  }

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

export const getStoryImageFallbackUrls = (value: string) => {
  const text = String(value || "").trim();

  if (!text) {
    return [];
  }

  const fileId = getGoogleDriveFileId(text);

  if (!fileId) {
    return [text];
  }

  return [
    buildStoryImageProxyUrl(fileId),
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
    `https://lh3.googleusercontent.com/d/${fileId}=w2000`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
  ].filter((url): url is string => Boolean(url));
};

const formatDate = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const fetchStoryMemories = async () => {
  const endpoint = import.meta.env.VITE_STORIES_SHEET_URL;

  if (!endpoint) {
    return [];
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Stories request failed with ${response.status}`);
  }

  const data = (await response.json()) as StoryMemoryApiRow[];

  return data
    .filter((row) => row.name && row.message && row.date)
    .map((row) => ({
      name: row.name!.trim(),
      date: formatDate(row.date!),
      message: row.message!.trim(),
      imageUrls: (row.photos ?? [])
        .map(normalizeStoryImageUrl)
        .filter((url): url is string => Boolean(url)),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
