import type { Channel } from "@shared/schema";

interface FavoritesSidebarProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export default function FavoritesSidebar({ channels, onSelectChannel }: FavoritesSidebarProps) {
  return (
    <aside className="w-64 h-screen overflow-y-auto bg-gray-700 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Favorites</h2>
      <div className="space-y-2">
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
          <div className="text-center text-gray-400">No favorites yet.</div>
        )}
      </div>
    </aside>
  );
}
