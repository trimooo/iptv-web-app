import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";
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
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      fluid: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [url]);

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
      className={`relative rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${themeStyles[theme]} ${className}`}
    >
      {/* Video Player */}
      <video ref={videoRef} className="video-js vjs-theme-city h-full w-full rounded-lg">
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          supports HTML5 video.
        </p>
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

      {/* Video Title */}
      <div className="absolute top-4 left-4 px-5 py-2 rounded-xl font-semibold backdrop-blur-md shadow-lg">
        {title}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-6 -translate-y-1/2">
        {onPrevious && (
          <Button
            onClick={onPrevious}
            className={`rounded-full transition-all hover:scale-110 hover:shadow-xl ${buttonStyles[buttonSize]}`}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            className={`rounded-full transition-all hover:scale-110 hover:shadow-xl ${buttonStyles[buttonSize]}`}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
}
