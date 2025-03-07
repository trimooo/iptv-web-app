import { motion } from "framer-motion";
import CategorySidebar from "@/components/category-sidebar";
import ChannelSidebar from "@/components/channel-sidebar";
import VideoPlayer from "@/components/video-player";
import { useIPTV } from "@/context/IPTVContext";
import LoadingScreen from "@/components/loading-screen";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Home() {
  const { selectedChannel, isLoading } = useIPTV();
  const defaultVideo = {
    name: "Welcome to IPTV",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  };

  // Add debug logging
  useEffect(() => {
    if (selectedChannel) {
      console.log('Playing channel:', {
        name: selectedChannel.name,
        url: selectedChannel.url
      });
    }
  }, [selectedChannel]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Responsive Sidebars Container */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="lg:flex h-[40vh] lg:h-full lg:min-w-[500px] lg:max-w-[600px] border-b lg:border-r border-gray-700/50"
      >
        {/* Category and Channel sidebars in a row on mobile, column on desktop */}
        <div className="flex flex-row lg:flex-row h-full">
          <div className="w-1/3 lg:w-[200px] h-full border-r border-gray-700/50">
            <CategorySidebar />
          </div>
          <div className="flex-1 h-full min-w-[300px]">
            <ChannelSidebar />
          </div>
        </div>
      </motion.div>

      {/* Main Content - Video Player */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-2 sm:p-4 md:p-6 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="w-full max-w-[1400px] mx-auto">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white/90 mb-2 md:mb-4">
            {selectedChannel?.name || defaultVideo.name}
          </h2>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            <VideoPlayer 
              url={selectedChannel?.url || defaultVideo.url}
              title={selectedChannel?.name || defaultVideo.name}
              buttonSize={window.innerWidth < 768 ? "small" : "medium"}
              theme="glass"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}