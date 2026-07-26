/**
 * @file HtmlSanitizer.ts
 * DOMPurify wrapper for sanitizing HTML content.
 * Used before rendering grammar lesson content.
 */

import DOMPurify from 'dompurify';

export class HtmlSanitizer {
  static sanitize(html: string): string {
    if (typeof window === 'undefined') return html;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'u',
        'ul', 'ol', 'li',
        'code', 'pre',
        'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
      ],
      ALLOWED_ATTR: ['class', 'style'],
    });
  }

  static sanitizeGrammarContent(content: string): string {
    return HtmlSanitizer.sanitize(content);
  }
}
