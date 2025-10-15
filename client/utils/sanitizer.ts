import DOMPurify from "dompurify";

// Configure DOMPurify with strict settings
const sanitizerConfig = {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  FORBID_TAGS: ["script", "object", "embed", "iframe", "form", "input"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Safe HTML string
 */
export const sanitizeHtml = (dirty: string): string => {
  if (typeof dirty !== "string") {
    return "";
  }
  
  return DOMPurify.sanitize(dirty, sanitizerConfig);
};

/**
 * Sanitizes plain text by removing HTML tags
 * @param text - The potentially unsafe text
 * @returns Safe plain text
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== "string") {
    return "";
  }
  
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Safely renders user-generated content
 * Use this instead of dangerouslySetInnerHTML
 * @param content - The content to render
 * @returns Object with __html property for safe rendering
 */
export const createSafeMarkup = (content: string) => {
  return {
    __html: sanitizeHtml(content)
  };
};

/**
 * Validates and sanitizes URL for safe usage
 * @param url - The URL to validate
 * @returns Safe URL or null if invalid
 */
export const sanitizeUrl = (url: string): string | null => {
  if (typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
};