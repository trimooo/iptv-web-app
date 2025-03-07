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
}

const IPTVContext = createContext<IPTVContextType | undefined>(undefined);

export function IPTVProvider({ children }: { children: React.ReactNode }) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    const lastChannel = localStorage.getItem('lastChannel');
    if (lastChannel) {
      setSelectedChannel(JSON.parse(lastChannel));
    }
  }, []);

  return (
    <IPTVContext.Provider
      value={{
        selectedChannel,
        selectedCategory,
        setSelectedChannel,
        setSelectedCategory,
        filteredChannels,
        allChannels,
        isLoading
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
