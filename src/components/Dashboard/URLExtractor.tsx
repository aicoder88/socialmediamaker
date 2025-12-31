import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface URLExtractorProps {
  url: string;
  onUrlChange: (url: string) => void;
  onLoad: () => void;
  isLoading: boolean;
  error?: string;
}

const URLExtractor: React.FC<URLExtractorProps> = ({
  url,
  onUrlChange,
  onLoad,
  isLoading,
  error,
}) => {
  return (
    <motion.div
      key="url-input"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Article URL
        </label>
        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <Input
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              className={`bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
          <Button
            onClick={onLoad}
            disabled={!url.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Extract
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default URLExtractor;
