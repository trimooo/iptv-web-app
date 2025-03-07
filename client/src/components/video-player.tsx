import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  title: string;
  className?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  buttonSize?: "small" | "medium" | "large"; // Allows button size customization
  theme?: "dark" | "light" | "glass"; // Different theme styles
}

export default function VideoPlayer({
  url,
  title,
  className = "",
  onPrevious,
  onNext,
  buttonSize = "medium",
  theme = "dark",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const [isMuted, setIsMuted] = useState(true); // Start muted to allow autoplay
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initializeHls = () => {
    if (!videoRef.current || !url?.endsWith('.m3u8')) return;

    setIsLoading(true);
    setError(null);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        startLevel: 2, // Start with a medium quality
        autoStartLoad: true,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        // Start playback muted to bypass autoplay restrictions
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play()
            .then(() => {
              console.log('Autoplay started');
            })
            .catch(err => {
              console.warn('Autoplay failed:', err);
              setError('Tap to play');
            });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('Network error, attempting recovery...');
              if (retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                hls.startLoad();
              } else {
                setError('Network error: Failed to load stream');
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('Media error, attempting recovery...');
              if (retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                hls.recoverMediaError();
              } else {
                setError('Media error: Failed to play stream');
              }
              break;
            default:
              hls.destroy();
              setError('Fatal playback error');
              break;
          }
        }
      });
    }
    // For browsers with native HLS support
    else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
      videoRef.current.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        videoRef.current?.play().catch(err => {
          console.warn('Native playback failed:', err);
          setError('Failed to start playback');
        });
      });
    }
  };

  useEffect(() => {
    retryCountRef.current = 0;
    initializeHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [url]);

  // Handle touch gestures
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
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Define dynamic styles based on props
  const buttonStyles = {
    small: "p-2 text-sm",
    medium: "p-3 text-base",
    large: "p-4 text-lg",
  };

  const themeStyles = {
    dark: "bg-black/90 text-white shadow-xl",
    light: "bg-white text-black shadow-md",
    glass: "bg-black/30 text-white backdrop-blur-lg shadow-lg",
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-[1200px] mx-auto ${className}`}
    >
      <div className="aspect-video relative rounded-lg overflow-hidden shadow-xl">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 md:w-12 md:h-12 border-3 md:border-4 border-gray-600 border-t-white rounded-full"
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

        {/* Mobile-friendly controls overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 opacity-0 hover:opacity-100 touch-none transition-opacity duration-300"
        >
          <div className="absolute top-0 left-0 right-0 p-2 md:p-4">
            <h2 className="text-white text-sm md:text-xl font-bold truncate">
              {title}
            </h2>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
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
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
