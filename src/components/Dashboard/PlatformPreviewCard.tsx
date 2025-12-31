import React from "react";
import { Badge } from "@/components/ui/badge";
import { Facebook, Linkedin, Twitter, Instagram, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import {
  PLATFORM_CHARACTER_LIMITS,
  PLATFORM_CONFIG,
  type PlatformType,
} from "@/constants/platformLimits";

interface PlatformPreviewCardProps {
  platform: PlatformType;
  content: string;
  characterLimit?: number;
  title?: string;
}

const platformIcons = {
  facebook: <Facebook className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  blog: <BookOpen className="h-5 w-5" />,
};

const PlatformPreviewCard: React.FC<PlatformPreviewCardProps> = ({
  platform,
  content,
  characterLimit,
  title = "",
}) => {
  const limit = characterLimit ?? PLATFORM_CHARACTER_LIMITS[platform];
  const truncatedContent =
    content.length > limit ? content.substring(0, limit) + "..." : content;

  const config = PLATFORM_CONFIG[platform];
  const icon = platformIcons[platform];
  const charactersUsed = content.length;
  const percentUsed = Math.min(Math.round((charactersUsed / limit) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5`}
      />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} text-white shadow-lg`}
            >
              {icon}
            </div>
            <div>
              <h3 className={`font-semibold ${config.textColor}`}>
                {config.name}
              </h3>
              <p className="text-xs text-gray-400">Preview</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${config.textColor} ${config.borderColor} bg-transparent`}
          >
            {percentUsed}%
          </Badge>
        </div>

        {platform === "blog" && title && (
          <h4 className="text-lg font-bold mb-3 text-white">{title}</h4>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
            {truncatedContent || "No content to preview"}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>
            {charactersUsed.toLocaleString()} / {limit.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${percentUsed > 90 ? "bg-red-400" : percentUsed > 70 ? "bg-yellow-400" : "bg-green-400"}`}
            />
            <span>{percentUsed > 90 ? "Near limit" : "Good"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlatformPreviewCard;
