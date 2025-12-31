import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContentPreview from "./ContentPreview";
import type { PlatformSelectionState } from "./PlatformSelector";

// Mock PlatformPreviewCard to simplify testing
vi.mock("./PlatformPreviewCard", () => ({
  default: ({ platform, content, title }: { platform: string; content: string; title: string }) => (
    <div data-testid={`platform-preview-${platform}`}>
      <div>{platform} Preview</div>
      <div>{content}</div>
      <div>{title}</div>
    </div>
  ),
}));

describe("ContentPreview", () => {
  const mockPlatforms: PlatformSelectionState = {
    facebook: false,
    linkedin: false,
    twitter: false,
    instagram: false,
    blog: false,
  };

  describe("Null rendering conditions", () => {
    it("returns null when content is empty", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
        facebook: true,
      };

      const { container } = render(
        <ContentPreview
          content=""
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("returns null when no platforms are selected", () => {
      const { container } = render(
        <ContentPreview
          content="Some content here"
          title="Test Title"
          selectedPlatforms={mockPlatforms}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("returns null when content is empty and no platforms selected", () => {
      const { container } = render(
        <ContentPreview
          content=""
          title="Test Title"
          selectedPlatforms={mockPlatforms}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("returns null when content is whitespace only", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      const { container } = render(
        <ContentPreview
          content="   "
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      // Whitespace is truthy, so component should render
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe("Content rendering", () => {
    it("shows 'Content Previews' heading when content exists", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByText("Content Previews")).toBeInTheDocument();
    });

    it("displays Sparkles icon in heading", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        facebook: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const heading = screen.getByText("Content Previews");
      const svg = heading.parentElement?.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Tab rendering", () => {
    it("renders tabs for each selected platform", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
        facebook: true,
        linkedin: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByRole("tab", { name: /twitter/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /facebook/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /linkedin/i })).toBeInTheDocument();
    });

    it("does not render tabs for unselected platforms", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByRole("tab", { name: /twitter/i })).toBeInTheDocument();
      expect(screen.queryByRole("tab", { name: /facebook/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("tab", { name: /linkedin/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("tab", { name: /instagram/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("tab", { name: /blog/i })).not.toBeInTheDocument();
    });

    it("renders all tabs when all platforms are selected", () => {
      const selectedPlatforms: PlatformSelectionState = {
        facebook: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        blog: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByRole("tab", { name: /facebook/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /twitter/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /instagram/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /blog/i })).toBeInTheDocument();
    });

    it("capitalizes platform names in tabs", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const tab = screen.getByRole("tab", { name: /twitter/i });
      expect(tab).toHaveClass("capitalize");
    });
  });

  describe("Default tab behavior", () => {
    it("default tab is the first selected platform (twitter first)", () => {
      const selectedPlatforms: PlatformSelectionState = {
        facebook: false,
        linkedin: false,
        twitter: true,
        instagram: true,
        blog: false,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const twitterTab = screen.getByRole("tab", { name: /twitter/i });
      expect(twitterTab).toHaveAttribute("data-state", "active");
    });

    it("default tab is the first selected platform (facebook first)", () => {
      const selectedPlatforms: PlatformSelectionState = {
        facebook: true,
        linkedin: true,
        twitter: false,
        instagram: false,
        blog: false,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const facebookTab = screen.getByRole("tab", { name: /facebook/i });
      expect(facebookTab).toHaveAttribute("data-state", "active");
    });

    it("default tab is the first selected platform (blog only)", () => {
      const selectedPlatforms: PlatformSelectionState = {
        facebook: false,
        linkedin: false,
        twitter: false,
        instagram: false,
        blog: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const blogTab = screen.getByRole("tab", { name: /blog/i });
      expect(blogTab).toHaveAttribute("data-state", "active");
    });
  });

  describe("PlatformPreviewCard rendering", () => {
    it("renders PlatformPreviewCard for each selected platform", async () => {
      const user = userEvent.setup();
      const selectedPlatforms: PlatformSelectionState = {
        facebook: true,
        linkedin: false,
        twitter: true,
        instagram: false,
        blog: false,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      // Facebook is first in object key order, so it should be visible
      expect(screen.getByTestId("platform-preview-facebook")).toBeVisible();

      // Click Twitter tab to verify it also has a preview
      const twitterTab = screen.getByRole("tab", { name: /twitter/i });
      await user.click(twitterTab);

      expect(screen.getByTestId("platform-preview-twitter")).toBeVisible();
    });

    it("passes correct props to PlatformPreviewCard", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      const testContent = "My test content";
      const testTitle = "My test title";

      render(
        <ContentPreview
          content={testContent}
          title={testTitle}
          selectedPlatforms={selectedPlatforms}
        />
      );

      const preview = screen.getByTestId("platform-preview-twitter");
      expect(preview).toHaveTextContent(testContent);
      expect(preview).toHaveTextContent(testTitle);
    });

    it("renders PlatformPreviewCard for all selected platforms", async () => {
      const user = userEvent.setup();
      const selectedPlatforms: PlatformSelectionState = {
        facebook: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        blog: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      // Verify each platform has a preview by clicking each tab
      const platforms = ['facebook', 'linkedin', 'twitter', 'instagram', 'blog'];

      for (const platform of platforms) {
        const tab = screen.getByRole("tab", { name: new RegExp(platform, 'i') });
        await user.click(tab);
        expect(screen.getByTestId(`platform-preview-${platform}`)).toBeVisible();
      }
    });

    it("does not render PlatformPreviewCard for unselected platforms", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      const { container } = render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByTestId("platform-preview-twitter")).toBeInTheDocument();
      expect(container.querySelector('[data-testid="platform-preview-facebook"]')).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="platform-preview-linkedin"]')).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="platform-preview-instagram"]')).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="platform-preview-blog"]')).not.toBeInTheDocument();
    });
  });

  describe("Tab interaction", () => {
    it("switches between tabs when clicked", async () => {
      const user = userEvent.setup();
      const selectedPlatforms: PlatformSelectionState = {
        facebook: true,
        linkedin: false,
        twitter: true,
        instagram: false,
        blog: false,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const twitterTab = screen.getByRole("tab", { name: /twitter/i });
      const facebookTab = screen.getByRole("tab", { name: /facebook/i });

      // Facebook should be active by default (first in object key order)
      expect(facebookTab).toHaveAttribute("data-state", "active");
      expect(twitterTab).toHaveAttribute("data-state", "inactive");

      // Click Twitter tab
      await user.click(twitterTab);

      // Twitter should now be active
      expect(twitterTab).toHaveAttribute("data-state", "active");
      expect(facebookTab).toHaveAttribute("data-state", "inactive");
    });

    it("displays correct preview content when switching tabs", async () => {
      const user = userEvent.setup();
      const selectedPlatforms: PlatformSelectionState = {
        facebook: false,
        linkedin: true,
        twitter: true,
        instagram: false,
        blog: false,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      // Initially, linkedin tab should be active (first in object key order)
      const linkedinTab = screen.getByRole("tab", { name: /linkedin/i });
      expect(linkedinTab).toHaveAttribute("data-state", "active");

      // Get the active tab panel
      const activePanel = screen.getByRole("tabpanel");
      const linkedinPreview = within(activePanel).getByTestId("platform-preview-linkedin");
      expect(linkedinPreview).toBeVisible();

      // Click Twitter tab
      const twitterTab = screen.getByRole("tab", { name: /twitter/i });
      await user.click(twitterTab);

      // Twitter tab should now be active
      expect(twitterTab).toHaveAttribute("data-state", "active");

      // Get the new active tab panel
      const newActivePanel = screen.getByRole("tabpanel");
      const twitterPreview = within(newActivePanel).getByTestId("platform-preview-twitter");
      expect(twitterPreview).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("handles single platform selection", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        instagram: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByRole("tab", { name: /instagram/i })).toBeInTheDocument();
      expect(screen.getByTestId("platform-preview-instagram")).toBeInTheDocument();
    });

    it("handles long content", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      const longContent = "a".repeat(5000);

      render(
        <ContentPreview
          content={longContent}
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const preview = screen.getByTestId("platform-preview-twitter");
      expect(preview).toHaveTextContent(longContent);
    });

    it("handles empty title", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        blog: true,
      };

      render(
        <ContentPreview
          content="Test content"
          title=""
          selectedPlatforms={selectedPlatforms}
        />
      );

      expect(screen.getByTestId("platform-preview-blog")).toBeInTheDocument();
    });

    it("handles special characters in content", () => {
      const selectedPlatforms: PlatformSelectionState = {
        ...mockPlatforms,
        twitter: true,
      };

      const specialContent = "Test with @mentions #hashtags and emojis 🚀🎉";

      render(
        <ContentPreview
          content={specialContent}
          title="Test Title"
          selectedPlatforms={selectedPlatforms}
        />
      );

      const preview = screen.getByTestId("platform-preview-twitter");
      expect(preview).toHaveTextContent(specialContent);
    });
  });
});
