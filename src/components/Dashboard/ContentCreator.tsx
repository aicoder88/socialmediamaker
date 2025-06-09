import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  Loader2,
  Link,
  FileText,
  Sparkles,
  Globe,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  BookOpen,
  Wand2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced PlatformPreviewCard component
interface PlatformPreviewCardProps {
  platform: "facebook" | "linkedin" | "twitter" | "instagram" | "blog";
  content: string;
  characterLimit: number;
  title?: string;
}

const PlatformPreviewCard: React.FC<PlatformPreviewCardProps> = ({
  platform,
  content,
  characterLimit,
  title = "",
}) => {
  const truncatedContent =
    content.length > characterLimit
      ? content.substring(0, characterLimit) + "..."
      : content;

  const platformConfig = {
    facebook: {
      icon: <Facebook className="h-5 w-5" />,
      name: "Facebook",
      gradient: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    linkedin: {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      gradient: "from-blue-700 to-blue-800",
      bgColor: "bg-blue-700/10",
      borderColor: "border-blue-600/30",
      textColor: "text-blue-300",
    },
    twitter: {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      gradient: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-400/30",
      textColor: "text-sky-300",
    },
    instagram: {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      gradient: "from-pink-600 to-purple-600",
      bgColor: "bg-pink-600/10",
      borderColor: "border-pink-500/30",
      textColor: "text-pink-300",
    },
    blog: {
      icon: <BookOpen className="h-5 w-5" />,
      name: "Blog",
      gradient: "from-emerald-600 to-green-600",
      bgColor: "bg-emerald-600/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-300",
    },
  };

  const config = platformConfig[platform];
  const charactersUsed = content.length;
  const percentUsed = Math.min(
    Math.round((charactersUsed / characterLimit) * 100),
    100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5`}
      />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} text-white shadow-lg`}
            >
              {config.icon}
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
            {charactersUsed.toLocaleString()} /{" "}
            {characterLimit.toLocaleString()}
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

interface ContentCreatorProps {
  onSubmit?: (data: ContentData) => Promise<void>;
}

interface ContentData {
  content: string;
  url?: string;
  platforms: {
    facebook: boolean;
    linkedin: boolean;
    twitter: boolean;
    instagram: boolean;
    blog: boolean;
  };
}

const ContentCreator: React.FC<ContentCreatorProps> = ({
  onSubmit = async () => {},
}) => {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    linkedin: true,
    twitter: true,
    instagram: false,
    blog: false,
  });

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const selectedPlatformCount =
    Object.values(selectedPlatforms).filter(Boolean).length;

  const handlePlatformToggle = (platform: keyof typeof selectedPlatforms) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleUrlLoad = async () => {
    if (!url.trim()) return;

    setIsLoadingUrl(true);
    try {
      // Mock URL content extraction (in real Next.js app, this would be an API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock extracted content
      const mockContent = `This is extracted content from ${url}. In a real implementation, this would use a service like Mercury Parser, Readability.js, or a custom web scraping solution to extract the main content from the webpage. The extracted content would include the article text, title, meta description, and potentially images.\n\nThe content extraction process typically involves:\n1. Fetching the HTML content from the URL\n2. Parsing the DOM structure\n3. Identifying the main content area\n4. Extracting text while preserving formatting\n5. Cleaning up unnecessary elements\n6. Returning structured data\n\nFor production use, consider integrating with:\n- Mercury Parser API for reliable content extraction\n- Custom Puppeteer/Playwright scripts for dynamic content\n- OpenAI API for content summarization and optimization\n- Rate limiting and caching for better performance`;
      const mockTitle = `Article from ${new URL(url).hostname}`;

      setContent(mockContent);
      setTitle(mockTitle);
      setSubmitStatus("idle");
    } catch (error) {
      console.error("Error loading URL:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await onSubmit({
        content,
        url: inputMode === "url" ? url : undefined,
        platforms: selectedPlatforms,
      });
      setSubmitStatus("success");
      // Reset form after successful submission
      setTimeout(() => {
        setContent("");
        setUrl("");
        setTitle("");
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error submitting content:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformToggles = [
    {
      key: "facebook" as const,
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      gradient: "from-blue-600 to-blue-700",
    },
    {
      key: "linkedin" as const,
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      gradient: "from-blue-700 to-blue-800",
    },
    {
      key: "twitter" as const,
      label: "Twitter",
      icon: <Twitter className="h-4 w-4" />,
      gradient: "from-sky-500 to-sky-600",
    },
    {
      key: "instagram" as const,
      label: "Instagram",
      icon: <Instagram className="h-4 w-4" />,
      gradient: "from-pink-600 to-purple-600",
    },
    {
      key: "blog" as const,
      label: "Blog",
      icon: <BookOpen className="h-4 w-4" />,
      gradient: "from-emerald-600 to-green-600",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Glassmorphic container with enhanced visuals */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-emerald-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <Card className="bg-transparent border-none shadow-none relative z-10">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg">
                  <Wand2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Content Creator
                  </CardTitle>
                  <p className="text-gray-400 mt-1">
                    Transform your content across all platforms
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20 px-3 py-1"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {wordCount} words
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20 px-3 py-1"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  {selectedPlatformCount} platforms
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Input Mode Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setInputMode("text")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    inputMode === "text"
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Write Content
                </button>
                <button
                  onClick={() => setInputMode("url")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    inputMode === "url"
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Link className="h-4 w-4" />
                  Import from URL
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {inputMode === "url" && (
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
                      <Input
                        placeholder="https://example.com/article"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                      <Button
                        onClick={handleUrlLoad}
                        disabled={!url.trim() || isLoadingUrl}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
                      >
                        {isLoadingUrl ? (
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
              )}
            </AnimatePresence>

            {/* Content Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {inputMode === "url"
                    ? "Extracted Content"
                    : "Article Content"}
                </label>
                {inputMode === "url" && (
                  <Badge
                    variant="outline"
                    className="text-xs text-gray-400 border-gray-600"
                  >
                    Auto-extracted from URL
                  </Badge>
                )}
              </div>

              {title && (
                <Input
                  placeholder="Article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 font-semibold"
                />
              )}

              <Textarea
                placeholder={
                  inputMode === "url"
                    ? "Content will appear here after URL extraction..."
                    : "Enter your article content here..."
                }
                className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Platform Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Select Platforms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {platformToggles.map((platform) => (
                  <motion.div
                    key={platform.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Toggle
                      pressed={selectedPlatforms[platform.key]}
                      onPressedChange={() => handlePlatformToggle(platform.key)}
                      className={`w-full h-16 flex flex-col items-center justify-center gap-1 border border-white/10 hover:border-white/20 transition-all duration-200 ${
                        selectedPlatforms[platform.key]
                          ? `bg-gradient-to-br ${platform.gradient} text-white shadow-lg border-transparent`
                          : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {platform.icon}
                      <span className="text-xs font-medium">
                        {platform.label}
                      </span>
                    </Toggle>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Platform Previews */}
            {content && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Content Previews
                </h3>

                <Tabs defaultValue="facebook" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 p-1">
                    {Object.entries(selectedPlatforms)
                      .filter(([_, selected]) => selected)
                      .map(([platform]) => (
                        <TabsTrigger
                          key={platform}
                          value={platform}
                          className="data-[state=active]:bg-white/10 data-[state=active]:text-white capitalize"
                        >
                          {platform}
                        </TabsTrigger>
                      ))}
                  </TabsList>

                  {Object.entries(selectedPlatforms)
                    .filter(([_, selected]) => selected)
                    .map(([platform]) => (
                      <TabsContent
                        key={platform}
                        value={platform}
                        className="mt-6"
                      >
                        <PlatformPreviewCard
                          platform={platform as any}
                          content={content}
                          title={title}
                          characterLimit={
                            platform === "twitter"
                              ? 280
                              : platform === "linkedin"
                                ? 1300
                                : platform === "instagram"
                                  ? 2200
                                  : platform === "blog"
                                    ? 5000
                                    : 500
                          }
                        />
                      </TabsContent>
                    ))}
                </Tabs>
              </div>
            )}

            {/* Status Messages */}
            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert className="bg-green-500/20 border-green-500/50 text-white">
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      Content successfully submitted for distribution across{" "}
                      {selectedPlatformCount} platforms!
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert className="bg-red-500/20 border-red-500/50 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to submit content. Please check your connection and
                      try again.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-6">
            <div className="text-sm text-gray-400">
              Ready to distribute to {selectedPlatformCount} platform
              {selectedPlatformCount !== 1 ? "s" : ""}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !content.trim() ||
                !Object.values(selectedPlatforms).some(Boolean)
              }
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Distribute Content
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContentCreator;
