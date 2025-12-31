import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Globe, Facebook, Linkedin, Twitter, Instagram, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { PLATFORM_CONFIG, type PlatformType } from "@/constants/platformLimits";

export interface PlatformSelectionState {
  facebook: boolean;
  linkedin: boolean;
  twitter: boolean;
  instagram: boolean;
  blog: boolean;
}

interface PlatformSelectorProps {
  selectedPlatforms: PlatformSelectionState;
  onToggle: (platform: PlatformType) => void;
}

const platformIcons: Record<PlatformType, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  blog: <BookOpen className="h-4 w-4" />,
};

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onToggle,
}) => {
  const platforms: PlatformType[] = ["facebook", "linkedin", "twitter", "instagram", "blog"];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Globe className="h-5 w-5" />
        Select Platforms
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          return (
            <motion.div
              key={platform}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Toggle
                pressed={selectedPlatforms[platform]}
                onPressedChange={() => onToggle(platform)}
                className={`w-full h-16 flex flex-col items-center justify-center gap-1 border border-white/10 hover:border-white/20 transition-all duration-200 ${
                  selectedPlatforms[platform]
                    ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg border-transparent`
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {platformIcons[platform]}
                <span className="text-xs font-medium">{config.name}</span>
              </Toggle>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;
