/**
 * HTML Sanitization Utility
 * Prevents XSS attacks by sanitizing user-provided HTML content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Allowed HTML tags for blog content
 * Restricts to safe formatting elements only
 */
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'ul', 'ol', 'li',
  'a',
  'img',
  'blockquote',
  'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
];

/**
 * Allowed HTML attributes
 * Only safe attributes that don't execute JavaScript
 */
const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'target', 'rel',
  'width', 'height',
  'colspan', 'rowspan',
];

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Untrusted HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force all links to open in new tab with noopener
    ADD_ATTR: ['target', 'rel'],
    // Prevent javascript: URLs
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Remove script tags completely
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    // Remove event handlers
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Sanitize plain text (strips all HTML)
 * @param dirty - Untrusted string
 * @returns Plain text with all HTML removed
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
