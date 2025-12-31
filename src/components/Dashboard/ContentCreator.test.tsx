import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ContentCreator from "./ContentCreator";

// Mock child components to isolate ContentCreator testing
vi.mock("./URLExtractor", () => ({
  default: ({
    url,
    onUrlChange,
    onLoad,
    isLoading,
    error,
  }: {
    url: string;
    onUrlChange: (url: string) => void;
    onLoad: () => void;
    isLoading: boolean;
    error?: string;
  }) => (
    <div data-testid="url-extractor">
      <input
        data-testid="url-input"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://example.com/article"
      />
      <button
        data-testid="extract-button"
        onClick={onLoad}
        disabled={!url.trim() || isLoading}
      >
        {isLoading ? "Loading..." : "Extract"}
      </button>
      {error && <p data-testid="url-error">{error}</p>}
    </div>
  ),
}));

vi.mock("./PlatformSelector", () => ({
  default: ({
    selectedPlatforms,
    onToggle,
  }: {
    selectedPlatforms: Record<string, boolean>;
    onToggle: (platform: string) => void;
  }) => (
    <div data-testid="platform-selector">
      {Object.entries(selectedPlatforms).map(([platform, selected]) => (
        <button
          key={platform}
          data-testid={`platform-${platform}`}
          onClick={() => onToggle(platform)}
          aria-pressed={selected}
        >
          {platform}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("./ContentPreview", () => ({
  default: ({
    content,
    title,
    selectedPlatforms,
  }: {
    content: string;
    title: string;
    selectedPlatforms: Record<string, boolean>;
  }) => (
    <div data-testid="content-preview">
      <div data-testid="preview-content">{content}</div>
      <div data-testid="preview-title">{title}</div>
      <div data-testid="preview-platforms">
        {JSON.stringify(selectedPlatforms)}
      </div>
    </div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ContentCreator", () => {
  describe("1. Rendering", () => {
    it("renders the main Content Creator heading", () => {
      render(<ContentCreator />);

      expect(screen.getByText("Content Creator")).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      render(<ContentCreator />);

      expect(
        screen.getByText("Transform your content across all platforms")
      ).toBeInTheDocument();
    });
  });

  describe("2. Word Count Badge", () => {
    it("shows word count badge starting at 0", () => {
      render(<ContentCreator />);

      expect(screen.getByText("0 words")).toBeInTheDocument();
    });

    it("updates word count when text is entered", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Hello world test" } });

      expect(screen.getByText("3 words")).toBeInTheDocument();
    });

    it("counts words correctly with multiple spaces", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Hello    world    test" } });

      expect(screen.getByText("3 words")).toBeInTheDocument();
    });

    it("shows 0 words for whitespace-only content", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "   " } });

      expect(screen.getByText("0 words")).toBeInTheDocument();
    });
  });

  describe("3. Platform Count Badge", () => {
    it("shows platform count badge", () => {
      render(<ContentCreator />);

      // Default: facebook, linkedin, twitter are selected (3 platforms)
      // Use getAllByText and check the header badge (first occurrence)
      const badges = screen.getAllByText("3 platforms");
      expect(badges[0]).toBeInTheDocument();
    });

    it("updates platform count when platforms are toggled", () => {
      render(<ContentCreator />);

      // Initially 3 platforms selected
      expect(screen.getAllByText("3 platforms")[0]).toBeInTheDocument();

      // Toggle facebook off
      const facebookButton = screen.getByTestId("platform-facebook");
      fireEvent.click(facebookButton);

      expect(screen.getAllByText("2 platforms")[0]).toBeInTheDocument();
    });

    it("shows singular 'platform' when only one is selected", () => {
      render(<ContentCreator />);

      // Disable linkedin and twitter, keep only facebook
      fireEvent.click(screen.getByTestId("platform-linkedin"));
      fireEvent.click(screen.getByTestId("platform-twitter"));

      // Check for "1 platforms" in header badge
      const badges = screen.getAllByText("1 platforms");
      expect(badges[0]).toBeInTheDocument();
    });
  });

  describe("4. Input Mode Switching", () => {
    it("can switch between text and URL input modes", () => {
      render(<ContentCreator />);

      // Initially in text mode
      expect(
        screen.getByPlaceholderText(/Enter your article content here.../)
      ).toBeInTheDocument();

      // Switch to URL mode
      const urlModeButton = screen.getByText("Import from URL");
      fireEvent.click(urlModeButton);

      // URL extractor should be visible
      expect(screen.getByTestId("url-extractor")).toBeInTheDocument();

      // Switch back to text mode
      const textModeButton = screen.getByText("Write Content");
      fireEvent.click(textModeButton);

      // URL extractor should not be visible
      expect(screen.queryByTestId("url-extractor")).not.toBeInTheDocument();
    });

    it("updates textarea placeholder in URL mode", () => {
      render(<ContentCreator />);

      const urlModeButton = screen.getByText("Import from URL");
      fireEvent.click(urlModeButton);

      expect(
        screen.getByPlaceholderText(
          /Content will appear here after URL extraction.../
        )
      ).toBeInTheDocument();
    });

    it("shows 'Extracted Content' label in URL mode", () => {
      render(<ContentCreator />);

      const urlModeButton = screen.getByText("Import from URL");
      fireEvent.click(urlModeButton);

      expect(screen.getByText("Extracted Content")).toBeInTheDocument();
    });

    it("shows 'Article Content' label in text mode", () => {
      render(<ContentCreator />);

      expect(screen.getByText("Article Content")).toBeInTheDocument();
    });
  });

  describe("5. Text Input", () => {
    it("updates content when text is entered", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content" } });

      expect(textarea).toHaveValue("Test content");
    });

    it("allows clearing content", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content" } });
      expect(textarea).toHaveValue("Test content");

      fireEvent.change(textarea, { target: { value: "" } });
      expect(textarea).toHaveValue("");
    });
  });

  describe("6. Submit Button - Empty Content", () => {
    it("disables submit button when content is empty", () => {
      render(<ContentCreator />);

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when content is added", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Valid content" } });

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      expect(submitButton).not.toBeDisabled();
    });

    it("disables submit button when content is only whitespace", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "   " } });

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("7. Submit Button - No Platforms Selected", () => {
    it("disables submit button when no platforms are selected", () => {
      render(<ContentCreator />);

      // Add content
      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Valid content" } });

      // Deselect all platforms
      fireEvent.click(screen.getByTestId("platform-facebook"));
      fireEvent.click(screen.getByTestId("platform-linkedin"));
      fireEvent.click(screen.getByTestId("platform-twitter"));

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when at least one platform is selected", () => {
      render(<ContentCreator />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Valid content" } });

      // At least one platform is selected by default
      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("8. Submit Handler", () => {
    it("calls onSubmit with correct data when submitted", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContentCreator onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content for submission" } });

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: "Test content for submission",
        url: undefined,
        platforms: {
          facebook: true,
          linkedin: true,
          twitter: true,
          instagram: false,
          blog: false,
        },
      });
    });

    it("includes URL when in URL mode", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContentCreator onSubmit={mockOnSubmit} />);

      // Switch to URL mode
      fireEvent.click(screen.getByText("Import from URL"));

      // Add URL
      const urlInput = screen.getByTestId("url-input");
      fireEvent.change(urlInput, { target: { value: "https://example.com/article" } });

      // Add content
      const textarea = screen.getByPlaceholderText(
        /Content will appear here after URL extraction.../
      );
      fireEvent.change(textarea, { target: { value: "Extracted content" } });

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: "Extracted content",
        url: "https://example.com/article",
        platforms: {
          facebook: true,
          linkedin: true,
          twitter: true,
          instagram: false,
          blog: false,
        },
      });
    });

    it("includes custom platform selection", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContentCreator onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content" } });

      // Toggle some platforms
      fireEvent.click(screen.getByTestId("platform-facebook")); // disable
      fireEvent.click(screen.getByTestId("platform-instagram")); // enable

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: "Test content",
        url: undefined,
        platforms: {
          facebook: false,
          linkedin: true,
          twitter: true,
          instagram: true,
          blog: false,
        },
      });
    });

    it("shows loading state during submission", async () => {
      const mockOnSubmit = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 1000))
        );
      render(<ContentCreator onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content" } });

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      fireEvent.click(submitButton);

      expect(screen.getByText("Processing...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("9. Success Message", () => {
    it("shows success message after successful submit", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContentCreator onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content" } });

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Content successfully submitted for distribution/)
        ).toBeInTheDocument();
      });
    });

    it("shows correct platform count in success message", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      render(<ContentCreator onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(
        /Enter your article content here.../
      );
      fireEvent.change(textarea, { target: { value: "Test content" } });

      // Enable one more platform (4 total)
      fireEvent.click(screen.getByTestId("platform-instagram"));

      const submitButton = screen.getByRole("button", {
        name: /Distribute Content/,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/across 4 platforms/)
        ).toBeInTheDocument();
      });
    });

  });

  describe("10. URL Validation", () => {
    it("accepts valid HTTP URLs without showing error", () => {
      render(<ContentCreator />);

      fireEvent.click(screen.getByText("Import from URL"));

      const urlInput = screen.getByTestId("url-input");
      fireEvent.change(urlInput, {
        target: { value: "http://example.com/article" },
      });

      // Should not show error for valid URL
      expect(screen.queryByTestId("url-error")).not.toBeInTheDocument();
    });

    it("accepts valid HTTPS URLs without showing error", () => {
      render(<ContentCreator />);

      fireEvent.click(screen.getByText("Import from URL"));

      const urlInput = screen.getByTestId("url-input");
      fireEvent.change(urlInput, {
        target: { value: "https://example.com/article" },
      });

      // Should not show error for valid URL
      expect(screen.queryByTestId("url-error")).not.toBeInTheDocument();
    });

    it("does not validate empty URL", () => {
      render(<ContentCreator />);

      fireEvent.click(screen.getByText("Import from URL"));

      // Extract button should be disabled for empty URL
      const extractButton = screen.getByTestId("extract-button");
      expect(extractButton).toBeDisabled();
    });
  });

  describe("Additional Features", () => {
    it("shows platform distribution info", () => {
      render(<ContentCreator />);

      expect(
        screen.getByText(/Ready to distribute to 3 platform/)
      ).toBeInTheDocument();
    });

    it("updates distribution info when platforms change", () => {
      render(<ContentCreator />);

      fireEvent.click(screen.getByTestId("platform-instagram"));

      expect(
        screen.getByText(/Ready to distribute to 4 platform/)
      ).toBeInTheDocument();
    });

    it("shows singular platform text for one platform", () => {
      render(<ContentCreator />);

      // Disable all but one platform
      fireEvent.click(screen.getByTestId("platform-linkedin"));
      fireEvent.click(screen.getByTestId("platform-twitter"));

      expect(
        screen.getByText(/Ready to distribute to 1 platform/)
      ).toBeInTheDocument();
    });
  });
});
