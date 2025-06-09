import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Linkedin, Twitter, Instagram, BookOpen } from "lucide-react";

interface PlatformPreviewCardProps {
  platform: "facebook" | "linkedin" | "twitter" | "instagram" | "blog";
  content: string;
  title?: string;
  estimatedEngagement?: number;
  characterLimit?: number;
  imageUrl?: string;
}

const PlatformPreviewCard = ({
  platform = "facebook",
  content = "This is a preview of how your content will appear on this platform. The formatting and character limits are specific to each social media platform.",
  title = "Content Preview",
  estimatedEngagement = 120,
  characterLimit = 280,
  imageUrl,
}: PlatformPreviewCardProps) => {
  // Platform-specific configurations
  const platformConfig = {
    facebook: {
      icon: <Facebook className="h-5 w-5" />,
      name: "Facebook",
      color: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-600/20",
      characterLimit: 63206,
    },
    linkedin: {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      color: "bg-blue-700",
      textColor: "text-blue-700",
      borderColor: "border-blue-700/20",
      characterLimit: 3000,
    },
    twitter: {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      color: "bg-sky-500",
      textColor: "text-sky-500",
      borderColor: "border-sky-500/20",
      characterLimit: 280,
    },
    instagram: {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      color: "bg-pink-600",
      textColor: "text-pink-600",
      borderColor: "border-pink-600/20",
      characterLimit: 2200,
    },
    blog: {
      icon: <BookOpen className="h-5 w-5" />,
      name: "Blog",
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-600/20",
      characterLimit: 100000,
    },
  };

  const config = platformConfig[platform];
  const truncatedContent =
    content.length > characterLimit
      ? `${content.substring(0, characterLimit - 3)}...`
      : content;

  const charactersUsed = content.length;
  const percentUsed = Math.min(
    Math.round((charactersUsed / config.characterLimit) * 100),
    100,
  );

  return (
    <Card
      className={`w-full h-full bg-background/60 backdrop-blur-md border ${config.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${config.color} p-1.5 rounded-full text-white`}>
              {config.icon}
            </div>
            <h3 className={`font-medium ${config.textColor}`}>{config.name}</h3>
          </div>
          <Badge
            variant="outline"
            className={`${config.textColor} ${config.borderColor}`}
          >
            {percentUsed}% used
          </Badge>
        </div>

        {platform === "blog" && title && (
          <h4 className="text-sm font-semibold mb-2 text-foreground">
            {title}
          </h4>
        )}

        <div className="flex-1 overflow-hidden">
          <p className="text-xs text-muted-foreground line-clamp-6">
            {truncatedContent}
          </p>
        </div>

        {imageUrl && (
          <div className="mt-3 h-20 w-full overflow-hidden rounded-md">
            <img
              src={
                imageUrl ||
                "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80"
              }
              alt="Preview image"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {charactersUsed} / {config.characterLimit} characters
          </span>
          <span>Est. engagement: {estimatedEngagement}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformPreviewCard;
