import type { Channel } from "@shared/schema";

interface ChannelSidebarProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export default function ChannelSidebar({ channels, onSelectChannel }: ChannelSidebarProps) {
  return (
    <aside className="w-64 h-screen bg-gray-700 text-white border-r border-gray-700 flex flex-col p-4 space-y-4 fixed left-[21rem] top-0">
      <h2 className="text-lg font-semibold">Channels</h2>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {channels.length > 0 ? (
          channels.map((channel) => (
            <div
              key={channel.id}
              className="p-2 rounded-md cursor-pointer hover:bg-primary/90 bg-gray-800"
              onClick={() => onSelectChannel(channel)}
            >
              {channel.name}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No channels available.</div>
        )}
      </div>
    </aside>
  );
}