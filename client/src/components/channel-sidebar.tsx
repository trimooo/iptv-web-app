import { motion } from "framer-motion";
import { useIPTV } from "@/context/IPTVContext";

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

  return (
    <div className="h-full bg-gray-700/50 backdrop-blur-sm p-3 sm:p-4">
      <h2 className="text-base sm:text-lg font-bold mb-6 text-white/90">Channels</h2>
      <div className="overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin scrollbar-thumb-gray-600">
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {filteredChannels.map((channel) => (
            <motion.div
              key={channel.id}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                selectedChannel?.id === channel.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/90 bg-gray-800"
              } ${!channel.url ? 'opacity-50' : ''}`}
              onClick={() => handleChannelSelect(channel)}
              whileHover={{ scale: channel.url ? 1.02 : 1 }}
              whileTap={{ scale: channel.url ? 0.98 : 1 }}
            >
              <div className="text-sm sm:text-base font-medium truncate">
                {channel.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 truncate mt-1">
                {channel.url ? channel.category : 'No URL available'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}