// client/src/lib/custom-hls-loader.ts
import Hls from 'hls.js';
import { processStreamUrl } from './stream-utils';

export class CustomHLSLoader extends Hls.DefaultConfig.loader {
  constructor(config: any) {
    super(config);
    
    const load = this.load.bind(this);
    
    this.load = function(context: any, config: any, callbacks: any) {
      // Process the URL if it's a segment or playlist
      if (context.type === 'manifest' || context.type === 'segment') {
        // For relative URLs in playlists, we need to keep them as is
        if (context.url.startsWith('http')) {
          context.url = processStreamUrl(context.url);
        }
      }
      
      // Enhanced retry logic
      const retryDelay = context.loadPolicy?.retry || 1000;
      const maxRetry = context.loadPolicy?.maxRetry || 6;
      
      const enhancedCallbacks = {
        onSuccess: callbacks.onSuccess,
        onError: (error: any, context: any, stats: any) => {
          console.log(`HLS ${context.type} error:`, error.code);
          
          if (stats.retry < maxRetry) {
            // Automatic retry with exponential backoff
            const delay = retryDelay * Math.pow(1.5, stats.retry);
            console.log(`Retrying ${context.type} (${stats.retry}/${maxRetry}) in ${delay}ms`);
            
            setTimeout(() => {
              load(context, config, callbacks);
            }, delay);
          } else {
            callbacks.onError(error, context, stats);
          }
        },
        onTimeout: callbacks.onTimeout,
        onProgress: callbacks.onProgress
      };
      
      // Call the original loader with our enhanced callbacks
      load(context, config, enhancedCallbacks);
    };
  }
}
