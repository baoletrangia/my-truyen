export const env = {
  sheetsId: process.env.NEXT_PUBLIC_SHEETS_ID ?? "",
  novelsSheet: process.env.NEXT_PUBLIC_SHEETS_NOVELS ?? "novels",
  chaptersSheet: process.env.NEXT_PUBLIC_SHEETS_CHAPTERS ?? "chapters",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  googleApiKey: process.env.GOOGLE_API_KEY ?? "",
  adminEmails: process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "My Truyen",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "A modern open-source platform for reading novels.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
};

export function assertSheetsConfig() {
  if (!env.sheetsId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SHEETS_ID. Add it to your environment variables.",
    );
  }
  if (!env.googleApiKey) {
    throw new Error(
      "Missing GOOGLE_API_KEY. Add it to your environment variables.",
    );
  }
  return env;
}
