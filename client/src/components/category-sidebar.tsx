import { useIPTV } from "@/context/IPTVContext";
import { motion } from "framer-motion";
import { FolderOpen, Tag, Filter } from "lucide-react";

export default function CategorySidebar() {
  const { allChannels, selectedCategory, setSelectedCategory } = useIPTV();
  const categories = Array.from(new Set(allChannels.map((c) => c.category).filter(Boolean)));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Get count of channels per category
  const getCategoryCount = (category: string | null) => {
    if (category === null) return allChannels.length;
    return allChannels.filter(c => c.category === category).length;
  };

  return (
    <motion.div 
      className="h-full bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-md p-3 sm:p-4 rounded-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center mb-6">
        <FolderOpen className="mr-2 text-purple-400" />
        <h2 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Categories
        </h2>
      </div>
      
      <motion.div 
        className="space-y-2 sm:space-y-3 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800/50 pr-1"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <button
            className={`w-full cursor-pointer p-2 sm:p-3 text-left text-sm sm:text-base transition-all rounded-lg ${
              selectedCategory === null 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20" 
                : "bg-gray-800/70 text-white/90 hover:bg-gray-700/80"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>All Channels</span>
              </div>
              <motion.div 
                className="bg-white/20 rounded-full px-2 py-0.5 text-xs"
                animate={selectedCategory === null ? { 
                  scale: [1, 1.1, 1],
                  backgroundColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {getCategoryCount(null)}
              </motion.div>
            </div>
          </button>
        </motion.div>
        
        {categories.map((category, index) => (
          <motion.div
            key={category}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            custom={index}
          >
            <button
              className={`w-full cursor-pointer p-2 sm:p-3 text-left text-sm sm:text-base transition-all rounded-lg ${
                selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20" 
                  : "bg-gray-800/70 text-white/90 hover:bg-gray-700/80"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{category}</span>
                </div>
                <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                  {getCategoryCount(category)}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}