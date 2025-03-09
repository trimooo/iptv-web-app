// client/src/lib/stream-utils.ts
/**
 * Utility functions for handling stream URLs
 */

/**
 * Creates a proxy URL for stream sources that require special headers
 */
export function getProxyUrl(originalUrl: string): string {
    // Encode the URL to handle special characters
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/proxy/stream/${encodedUrl}`;
  }
  
  /**
   * Determines if a URL needs to be proxied
   */
  export function needsProxy(url: string): boolean {
    // Check for common patterns that indicate a stream might need proxying
    return (
      url.endsWith('.m3u8') || // HLS streams
      url.includes('token=') || // Token-based streams
      url.includes('xtream') || // Xtream API streams
      url.includes('.ts') // TS segments
    );
  }
  
  /**
   * Process a stream URL to determine if it needs proxying
   */
  export function processStreamUrl(originalUrl: string): string {
    if (!originalUrl) return '';
    
    if (needsProxy(originalUrl)) {
      return getProxyUrl(originalUrl);
    }
    
    return originalUrl;
  }
  