import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  title: string;
  className?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  buttonSize?: "small" | "medium" | "large";
  theme?: "dark" | "light" | "glass" | "tv";
}

export default function VideoPlayer({
  url,
  title,
  className = "",
  onPrevious,
  onNext,
  buttonSize = "medium",
  theme = "tv",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayingTimeRef = useRef<number>(Date.now());
  const proxyUrlRef = useRef<string | null>(null);

  // Function to create a proxy URL or add headers if needed
  const getStreamUrl = (originalUrl: string): string => {
    // If we already have a working proxy URL, use it
    if (proxyUrlRef.current) {
      return proxyUrlRef.current;
    }
    
    // Check if the URL contains tokens or special parameters
    if (originalUrl.includes('token=')) {
      // For URLs with tokens, we'll use them directly but might need to refresh them
      return originalUrl;
    }
    
    // For other URLs, we could use a proxy if needed
    // This is where you could implement a proxy solution if required
    return originalUrl;
  };

  const initializeHls = () => {
    if (!videoRef.current || !url?.endsWith('.m3u8')) return;

    setIsLoading(true);
    setError(null);
    retryCountRef.current = 0;

    // Clear any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      try {
        const streamUrl = getStreamUrl(url);
        
        const hls = new Hls({
          xhrSetup: (xhr) => {
            // Add headers to prevent 406 errors
            xhr.setRequestHeader('Origin', window.location.origin);
            xhr.setRequestHeader('Referer', window.location.origin);
            xhr.setRequestHeader('Accept', '*/*');
            xhr.setRequestHeader('User-Agent', navigator.userAgent);
          },
          // Improved configuration for better streaming
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          startLevel: -1, // Auto level selection
          autoStartLoad: true,
          // More lenient retry settings
          fragLoadingMaxRetry: 15,
          manifestLoadingMaxRetry: 15,
          levelLoadingMaxRetry: 15,
          fragLoadingRetryDelay: 1000,
          manifestLoadingRetryDelay: 1000,
          levelLoadingRetryDelay: 1000,
          // Disable debug logs
          debug: false
        });

        hlsRef.current = hls;
        
        // Set up watchdog timer to detect freezes
        setupWatchdog();
        
        // Load the source
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play()
              .then(() => {
                lastPlayingTimeRef.current = Date.now();
                // If we successfully loaded the stream, store the URL that worked
                proxyUrlRef.current = streamUrl;
              })
              .catch(() => {
                setError('Tap to play');
              });
          }
        });

        // Handle all errors with improved recovery
        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.log("HLS error:", data.type, data.details);
          
          // For 406 errors specifically, try a different approach
          if (data.response && data.response.code === 406) {
            // Try to refresh the URL or use a different approach
            retryWithRefreshedUrl();
            return;
          }
          
          // Don't show errors for non-fatal issues
          if (!data.fatal) {
            return;
          }

          // For fatal errors, try to recover silently
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            // Just restart loading without showing any UI
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          }
          
          // Only increment retry counter for fatal errors
          retryCountRef.current++;
          
          // If we've tried too many times, reinitialize the player
          if (retryCountRef.current > maxRetries) {
            // Complete reset of the player
            setTimeout(() => {
              if (hlsRef.current === hls) {  // Only if this is still the current instance
                // Reset the proxy URL reference to try a fresh approach
                proxyUrlRef.current = null;
                initializeHls();
              }
            }, 1000);
          }
        });
        
        // Reset error state when playback resumes
        hls.on(Hls.Events.FRAG_LOADED, () => {
          lastPlayingTimeRef.current = Date.now();
          if (error) {
            setError(null);
          }
        });
        
      } catch (err) {
        console.error("Error initializing HLS:", err);
        setError('Failed to initialize player');
      }
    }
    else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      const streamUrl = getStreamUrl(url);
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        videoRef.current?.play().catch(() => {
          setError('Failed to start playback');
        });
      });
    }
  };

  // Function to retry with a refreshed URL (for token-based streams)
  const retryWithRefreshedUrl = async () => {
    // Reset the proxy URL to force a fresh attempt
    proxyUrlRef.current = null;
    
    // For token-based URLs, we might need to refresh the token
    // This is a simplified example - you might need to implement token refresh logic
    
    // Wait a moment before retrying
    setTimeout(() => {
      initializeHls();
    }, 1000);
  };

  // Setup a watchdog timer to detect and recover from freezes
  const setupWatchdog = () => {
    if (watchdogTimerRef.current) {
      clearInterval(watchdogTimerRef.current);
    }
    
    lastPlayingTimeRef.current = Date.now();
    
    watchdogTimerRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastPlaying = now - lastPlayingTimeRef.current;
      
      // If video has been frozen for more than 10 seconds and we're not showing an error
      if (timeSinceLastPlaying > 10000 && !error && !isLoading) {
        // Try to recover by restarting the stream
        if (hlsRef.current) {
          hlsRef.current.startLoad();
          
          // If we've been stuck for over 20 seconds, do a full reinitialize
          if (timeSinceLastPlaying > 20000) {
            // Reset the proxy URL to try a fresh approach
            proxyUrlRef.current = null;
            initializeHls();
          }
        }
      }
    }, 5000);
  };

  useEffect(() => {
    initializeHls();

    // Setup progress tracking
    const updateProgress = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        
        // Update last playing time if video is actually playing
        if (currentTime > 0 && !videoRef.current.paused) {
          lastPlayingTimeRef.current = Date.now();
        }
        
        if (duration) {
          setProgress((currentTime / duration) * 100);
        }
      }
    };

    const progressInterval = setInterval(updateProgress, 1000);

    // Add event listeners for video state
    const video = videoRef.current;
    if (video) {
      // Update last playing time when video is playing
      video.addEventListener('playing', () => {
        lastPlayingTimeRef.current = Date.now();
        setIsLoading(false);
        setError(null);
      });
      
      // Handle stalled playback
      video.addEventListener('stalled', () => {
        // Don't show loading immediately, give it time to recover
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState < 3) {
            // Still stalled after delay, try to recover
            if (hlsRef.current) {
              hlsRef.current.startLoad();
            }
          }
        }, 3000);
      });
    }

    return () => {
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
      }
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      
      clearInterval(progressInterval);
      
      // Remove event listeners
      if (video) {
        video.removeEventListener('playing', () => {});
        video.removeEventListener('stalled', () => {});
      }
    };
  }, [url]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Horizontal swipe for seeking
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30) {
        if (videoRef.current) {
          videoRef.current.currentTime += (deltaX > 0 ? 10 : -10);
          showControlsTemporarily();
        }
      }
    };

    const handleMouseMove = () => {
      showControlsTemporarily();
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', () => setShowControls(prev => !prev));

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', () => setShowControls(prev => !prev));
    };
  }, []);

  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn('Could not enable fullscreen mode:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.warn('Could not exit fullscreen mode:', err);
      });
    }
  };

  // Button styling based on props and theme
  const buttonStyles = {
    small: "p-2 text-sm",
    medium: "p-3 text-base",
    large: "p-4 text-lg",
  };

  const themeStyles = {
    dark: "bg-black/90 text-white shadow-xl",
    light: "bg-white text-black shadow-md",
    glass: "bg-black/30 text-white backdrop-blur-lg shadow-lg",
    tv: "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-500/30"
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden ${className}`}
    >
      <div className="aspect-video relative rounded-lg overflow-hidden shadow-2xl">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-20"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  boxShadow: ["0 0 15px #3b82f6", "0 0 5px #8b5cf6", "0 0 15px #3b82f6"]
                }}
                transition={{
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
                className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-purple-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <video
          ref={videoRef}
          className="w-full h-full"
          crossOrigin="anonymous"
          playsInline
          muted={isMuted}
          poster="/thumbnail.jpg"
        />

        {/* TV-styled controls overlay */}
        <AnimatePresence>
          {(showControls || isLoading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 touch-none"
            >
              {/* Channel info bar */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center"
              >
                <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 px-4 py-2 rounded-lg shadow-lg">
                  <h2 className="text-white text-sm md:text-xl font-bold truncate">
                    {title}
                  </h2>
                </div>
              </motion.div>

              {/* Progress bar */}
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-16 md:bottom-20 left-4 right-4"
              >
                <div className="h-1 md:h-2 bg-gray-700/70 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>

              {/* Control buttons */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  {onPrevious && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onPrevious}
                      className={`${buttonStyles[buttonSize]} ${themeStyles[theme]} rounded-full`}
                    >
                      <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                    className={`${buttonStyles[buttonSize]} ${themeStyles[theme]} rounded-full`}
                  >
                    {isMuted ? 
                      <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : 
                      <Volume2 className="w-4 h-4 md:w-6 md:h-6" />
                    }
                  </motion.button>
                </div>

                <div className="flex items-center space-x-3 md:space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className={`${buttonStyles[buttonSize]} ${themeStyles[theme]} rounded-full`}
                  >
                    {isFullscreen ? 
                      <Minimize className="w-4 h-4 md:w-6 md:h-6" /> : 
                      <Maximize className="w-4 h-4 md:w-6 md:h-6" />
                    }
                  </motion.button>
                  
                  {onNext && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onNext}
                      className={`${buttonStyles[buttonSize]} ${themeStyles[theme]} rounded-full`}
                    >
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error display */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
            <div className="bg-red-500/90 p-4 rounded-lg text-white">
              <p>{error}</p>
              <button 
                onClick={initializeHls}
                className="mt-2 bg-white text-red-500 px-4 py-2 rounded w-full font-bold"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}