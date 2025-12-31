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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  Loader2,
  FileText,
  Sparkles,
  Globe,
  Wand2,
  Link,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

import URLExtractor from "./URLExtractor";
import PlatformSelector, { type PlatformSelectionState } from "./PlatformSelector";
import ContentPreview from "./ContentPreview";
import { type PlatformType } from "@/constants/platformLimits";

interface ContentCreatorProps {
  onSubmit?: (data: ContentData) => Promise<void>;
}

interface ContentData {
  content: string;
  url?: string;
  platforms: PlatformSelectionState;
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const ContentCreator: React.FC<ContentCreatorProps> = ({
  onSubmit = async () => {},
}) => {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformSelectionState>({
    facebook: true,
    linkedin: true,
    twitter: true,
    instagram: false,
    blog: false,
  });

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const selectedPlatformCount =
    Object.values(selectedPlatforms).filter(Boolean).length;

  const handlePlatformToggle = (platform: PlatformType) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setUrlError(undefined);
  };

  const handleUrlLoad = async () => {
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL (e.g., https://example.com/article)");
      return;
    }

    setUrlError(undefined);
    setIsLoadingUrl(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockContent = `This is extracted content from ${url}. In a real implementation, this would use a service like Mercury Parser, Readability.js, or a custom web scraping solution to extract the main content from the webpage. The extracted content would include the article text, title, meta description, and potentially images.\n\nThe content extraction process typically involves:\n1. Fetching the HTML content from the URL\n2. Parsing the DOM structure\n3. Identifying the main content area\n4. Extracting text while preserving formatting\n5. Cleaning up unnecessary elements\n6. Returning structured data\n\nFor production use, consider integrating with:\n- Mercury Parser API for reliable content extraction\n- Custom Puppeteer/Playwright scripts for dynamic content\n- OpenAI API for content summarization and optimization\n- Rate limiting and caching for better performance`;
      const mockTitle = `Article from ${new URL(url).hostname}`;

      setContent(mockContent);
      setTitle(mockTitle);
      setSubmitStatus("idle");
    } catch (error) {
      console.error("Error loading URL:", error);
      setUrlError("Failed to extract content. Please check the URL and try again.");
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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
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
                <URLExtractor
                  url={url}
                  onUrlChange={handleUrlChange}
                  onLoad={handleUrlLoad}
                  isLoading={isLoadingUrl}
                  error={urlError}
                />
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {inputMode === "url" ? "Extracted Content" : "Article Content"}
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

            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onToggle={handlePlatformToggle}
            />

            <Separator className="bg-white/10" />

            <ContentPreview
              content={content}
              title={title}
              selectedPlatforms={selectedPlatforms}
            />

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
