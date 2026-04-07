export interface FamilyMessage {
  name: string;
  email?: string;
  message: string;
  date: string;
}

interface FamilyMessageApiRow {
  name?: string;
  email?: string;
  message?: string;
  date?: string;
}

const FAMILY_MESSAGES_SHEET = "Family Messages";

const getStoriesSheetEndpoint = () => import.meta.env.VITE_STORIES_SHEET_URL;

const buildEndpoint = () => {
  const endpoint = getStoriesSheetEndpoint();

  if (!endpoint) {
    return null;
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}sheet=${encodeURIComponent(FAMILY_MESSAGES_SHEET)}`;
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

export const submitFamilyMessage = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => {
  const endpoint = buildEndpoint();

  if (!endpoint) {
    throw new Error("VITE_STORIES_SHEET_URL is not configured.");
  }

  const formData = new FormData();
  formData.append("sheet", FAMILY_MESSAGES_SHEET);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("message", message);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Family message request failed with ${response.status}`);
  }
};

export const fetchFamilyMessages = async () => {
  const endpoint = buildEndpoint();

  if (!endpoint) {
    return [];
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Family messages request failed with ${response.status}`);
  }

  const data = (await response.json()) as FamilyMessageApiRow[];

  return data
    .filter((row) => row.name && row.message && row.date)
    .map((row) => ({
      name: row.name!.trim(),
      ...(row.email ? { email: row.email.trim() } : {}),
      date: formatDate(row.date!),
      message: row.message!.trim(),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
