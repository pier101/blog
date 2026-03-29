export const siteName = "pier101";
export const siteDescription = "차분한 톤으로 개발 기록을 정리하는 심플한 한국어 기술 블로그";
export const siteLocale = "ko_KR";
export const siteLanguage = "ko-KR";
export const siteAuthorName = "pier101";
export const siteAccentColor = "#3B82F6";
export const siteAccentSoftColor = "#DBEAFE";
export const defaultOgImagePath = "/opengraph-image";

function parseSiteUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().replace(/\/+$/, "");

  if (!normalizedValue) {
    return null;
  }

  try {
    return new URL(`${normalizedValue}/`);
  } catch {
    return null;
  }
}

export const siteUrl = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const hasConfiguredSiteUrl = Boolean(siteUrl);

export function createAbsoluteUrl(pathname: string) {
  if (!siteUrl) {
    return null;
  }

  return new URL(pathname, siteUrl).toString();
}

export function resolveMetadataImage(pathname?: string) {
  const imagePath = pathname ?? defaultOgImagePath;

  return createAbsoluteUrl(imagePath);
}
