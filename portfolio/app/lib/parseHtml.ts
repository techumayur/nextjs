/**
 * Decodes potentially escaped HTML entities like &lt;br&gt; which are common in ACF fields
 * when they are set as Text but used with HTML tags, or when the REST API escapes them.
 */
export function parseHtml(html: string | undefined | null): string {
  if (!html) return "";
  
  return html
    .replace(/&lt;br\s*\/??&gt;/gi, '<br />')
    .replace(/&lt;p&gt;/gi, '<p>')
    .replace(/&lt;\/p&gt;/gi, '</p>')
    .replace(/&lt;strong&gt;/gi, '<strong>')
    .replace(/&lt;\/strong&gt;/gi, '</strong>')
    .replace(/&lt;span(.*?)&gt;/gi, '<span$1>')
    .replace(/&lt;\/span&gt;/gi, '</span>')
    .replace(/&amp;/g, '&')
    .replace(/\r\n/g, '<br />')
    .replace(/\n/g, '<br />');
}

/**
 * Mimics WordPress wpautop() function.
 * Converts double line breaks into <p> tags and wraps everything in a <p> if missing.
 */
export function wpAutop(html: string | undefined | null): string {
  if (!html) return "";
  
  let result = parseHtml(html);
  
  // If it already contains paragraph tags, don't wrap the whole thing again
  if (result.includes('<p>') || result.includes('<P>')) {
    return result;
  }
  
  // Replace double newlines with paragraph breaks
  const trimmed = result.trim();
  if (!trimmed) return "";
  
  return '<p>' + trimmed
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>')
    .replace(/\r\n\r\n|\n\n/g, '</p><p>') + '</p>';
}
