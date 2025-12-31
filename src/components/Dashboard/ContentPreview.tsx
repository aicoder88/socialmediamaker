import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import PlatformPreviewCard from "./PlatformPreviewCard";
import { PLATFORM_CHARACTER_LIMITS, type PlatformType } from "@/constants/platformLimits";
import type { PlatformSelectionState } from "./PlatformSelector";

interface ContentPreviewProps {
  content: string;
  title: string;
  selectedPlatforms: PlatformSelectionState;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  title,
  selectedPlatforms,
}) => {
  const activePlatforms = (Object.entries(selectedPlatforms) as [PlatformType, boolean][])
    .filter(([, selected]) => selected)
    .map(([platform]) => platform);

  if (!content || activePlatforms.length === 0) {
    return null;
  }

  const defaultTab = activePlatforms[0];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        Content Previews
      </h3>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          {activePlatforms.map((platform) => (
            <TabsTrigger
              key={platform}
              value={platform}
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white capitalize"
            >
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>

        {activePlatforms.map((platform) => (
          <TabsContent key={platform} value={platform} className="mt-6">
            <PlatformPreviewCard
              platform={platform}
              content={content}
              title={title}
              characterLimit={PLATFORM_CHARACTER_LIMITS[platform]}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentPreview;
