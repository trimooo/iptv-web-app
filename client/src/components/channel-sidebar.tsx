import { motion } from "framer-motion";
import { useIPTV } from "@/context/IPTVContext";
import { Tv2, Star } from "lucide-react";

interface Channel {
  id: number;
  name: string;
  url: string;
  category: string;
  sourceType?: 'm3u' | 'xtream';
  sourceId?: string;
  thumbnail: string;
}

export default function ChannelSidebar() {
  const { filteredChannels, selectedChannel, setSelectedChannel } = useIPTV();

  const handleChannelSelect = (channel: Channel) => {
    if (!channel.url) {
      console.error('Channel has no URL:', channel);
      return;
    }
    console.log('Selected channel:', channel);
    setSelectedChannel(channel);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    tap: { scale: 0.97 }
  };

  return (
    <motion.div 
      className="h-full bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-md p-3 sm:p-4 rounded-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white/90 flex items-center">
          <Tv2 className="mr-2 text-blue-400" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Channels
          </span>
        </h2>
        <motion.div 
          className="bg-blue-600/20 p-1 rounded-md text-xs text-blue-400"
          animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {filteredChannels.length} Available
        </motion.div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800/50 pr-1">
        <motion.div 
          className="grid grid-cols-1 gap-2 sm:gap-3"
          variants={containerVariants}
        >
          {filteredChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                selectedChannel?.id === channel.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20"
                  : "hover:bg-gray-700/80 bg-gray-800/70 text-white/90"
              } ${!channel.url ? 'opacity-50' : ''}`}
              onClick={() => handleChannelSelect(channel)}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              custom={index}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base font-medium truncate flex-1">
                  {channel.name}
                </div>
                {selectedChannel?.id === channel.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Star className="h-4 w-4 text-yellow-300 ml-2" fill="currentColor" />
                  </motion.div>
                )}
              </div>
              <div className="text-xs sm:text-sm text-blue-300/80 truncate mt-1 font-light">
                {channel.url ? channel.category : 'No URL available'}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}