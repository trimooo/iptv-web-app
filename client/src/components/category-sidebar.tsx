import { Badge } from "@/components/ui/badge";
import { useIPTV } from "@/context/IPTVContext";
import { motion } from "framer-motion";

export default function CategorySidebar() {
  const { allChannels, selectedCategory, setSelectedCategory } = useIPTV();
  const categories = Array.from(new Set(allChannels.map((c) => c.category).filter(Boolean)));

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-sm p-3 sm:p-4">
      <h2 className="text-base sm:text-lg font-bold mb-6 text-white/90">Categories</h2>
      <div className="space-y-2 sm:space-y-3 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin scrollbar-thumb-gray-600">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="w-full cursor-pointer p-2 sm:p-3 text-center text-sm sm:text-base hover:bg-primary/90 transition-colors"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
        </motion.div>
        {categories.map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Badge
              variant={selectedCategory === category ? "default" : "outline"}
              className="w-full cursor-pointer p-2 sm:p-3 text-center text-sm sm:text-base hover:bg-primary/90 transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}