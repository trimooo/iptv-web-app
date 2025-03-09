import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Channel } from "@shared/schema";

interface IPTVContextType {
  selectedChannel: Channel | null;
  selectedCategory: string | null;
  setSelectedChannel: (channel: Channel | null) => void;
  setSelectedCategory: (category: string | null) => void;
  filteredChannels: Channel[];
  allChannels: Channel[];
  isLoading: boolean;
  favorites: number[];
  toggleFavorite: (channelId: number) => void;
  isFavorite: (channelId: number) => boolean;
  lastWatched: Channel[];
}

const IPTVContext = createContext<IPTVContextType | undefined>(undefined);

export function IPTVProvider({ children }: { children: React.ReactNode }) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [lastWatched, setLastWatched] = useState<Channel[]>([]);

  const { data: allChannels = [], isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/channels");
      console.log("Fetched channels:", response);
      return response || [];
    },
  });

  const filteredChannels = selectedCategory
    ? allChannels.filter((channel) => channel.category === selectedCategory)
    : allChannels;

  useEffect(() => {
    // Load last watched channel
    const lastChannel = localStorage.getItem('lastChannel');
    if (lastChannel) {
      setSelectedChannel(JSON.parse(lastChannel));
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Load watch history
    const watchHistory = localStorage.getItem('watchHistory');
    if (watchHistory) {
      setLastWatched(JSON.parse(watchHistory));
    }
  }, []);

  // Save selected channel to last watched
  useEffect(() => {
    if (selectedChannel) {
      localStorage.setItem('lastChannel', JSON.stringify(selectedChannel));
      
      // Update watch history - add to front, remove duplicates, limit to 10
      setLastWatched(prev => {
        const filtered = prev.filter(c => c.id !== selectedChannel.id);
        const updated = [selectedChannel, ...filtered].slice(0, 10);
        localStorage.setItem('watchHistory', JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedChannel]);

  // Functions to manage favorites
  const toggleFavorite = (channelId: number) => {
    setFavorites(prev => {
      const isFav = prev.includes(channelId);
      const updated = isFav
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (channelId: number) => favorites.includes(channelId);

  return (
    <IPTVContext.Provider
      value={{
        selectedChannel,
        selectedCategory,
        setSelectedChannel,
        setSelectedCategory,
        filteredChannels,
        allChannels,
        isLoading,
        favorites,
        toggleFavorite,
        isFavorite,
        lastWatched
      }}
    >
      {children}
    </IPTVContext.Provider>
  );
}

export const useIPTV = () => {
  const context = useContext(IPTVContext);
  if (!context) {
    throw new Error("useIPTV must be used within IPTVProvider");
  }
  return context;
};