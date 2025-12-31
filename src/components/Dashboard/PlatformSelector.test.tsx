import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlatformSelector, { type PlatformSelectionState } from "./PlatformSelector";

describe("PlatformSelector", () => {
  const mockOnToggle = vi.fn();

  const defaultSelection: PlatformSelectionState = {
    facebook: false,
    linkedin: false,
    twitter: false,
    instagram: false,
    blog: false,
  };

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  describe("Rendering", () => {
    it("renders all 5 platform buttons", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      // Check that all 5 platform buttons are rendered
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(5);
    });

    it("shows correct platform names", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      // Verify all platform names are displayed
      expect(screen.getByText("Facebook")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByText("Twitter")).toBeInTheDocument();
      expect(screen.getByText("Instagram")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      expect(screen.getByText("Select Platforms")).toBeInTheDocument();
    });

    it("renders platform icons for each button", () => {
      const { container } = render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      // Each button should have an SVG icon (lucide-react icons render as SVG)
      const svgIcons = container.querySelectorAll("svg");
      // 5 platform icons + 1 Globe icon in heading = 6 total
      expect(svgIcons.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe("Click Interactions", () => {
    it("calls onToggle with 'facebook' when Facebook button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");
      expect(facebookButton).toBeInTheDocument();

      await user.click(facebookButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith("facebook");
    });

    it("calls onToggle with 'linkedin' when LinkedIn button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const linkedinButton = screen.getByText("LinkedIn").closest("button");
      await user.click(linkedinButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith("linkedin");
    });

    it("calls onToggle with 'twitter' when Twitter button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const twitterButton = screen.getByText("Twitter").closest("button");
      await user.click(twitterButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith("twitter");
    });

    it("calls onToggle with 'instagram' when Instagram button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const instagramButton = screen.getByText("Instagram").closest("button");
      await user.click(instagramButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith("instagram");
    });

    it("calls onToggle with 'blog' when Blog button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const blogButton = screen.getByText("Blog").closest("button");
      await user.click(blogButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith("blog");
    });

    it("allows clicking multiple platforms sequentially", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");
      const linkedinButton = screen.getByText("LinkedIn").closest("button");
      const blogButton = screen.getByText("Blog").closest("button");

      await user.click(facebookButton!);
      await user.click(linkedinButton!);
      await user.click(blogButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(3);
      expect(mockOnToggle).toHaveBeenNthCalledWith(1, "facebook");
      expect(mockOnToggle).toHaveBeenNthCalledWith(2, "linkedin");
      expect(mockOnToggle).toHaveBeenNthCalledWith(3, "blog");
    });
  });

  describe("Visual States", () => {
    it("shows visual distinction for unselected platforms", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");
      expect(facebookButton).toHaveClass("bg-white/5");
      expect(facebookButton).toHaveClass("text-gray-400");
    });

    it("shows visual distinction for selected Facebook", () => {
      const selectedState: PlatformSelectionState = {
        ...defaultSelection,
        facebook: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={selectedState}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");
      expect(facebookButton).toHaveClass("from-blue-600");
      expect(facebookButton).toHaveClass("to-blue-700");
      expect(facebookButton).toHaveClass("text-white");
    });

    it("shows visual distinction for selected LinkedIn", () => {
      const selectedState: PlatformSelectionState = {
        ...defaultSelection,
        linkedin: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={selectedState}
          onToggle={mockOnToggle}
        />
      );

      const linkedinButton = screen.getByText("LinkedIn").closest("button");
      expect(linkedinButton).toHaveClass("from-blue-700");
      expect(linkedinButton).toHaveClass("to-blue-800");
      expect(linkedinButton).toHaveClass("text-white");
    });

    it("shows visual distinction for selected Twitter", () => {
      const selectedState: PlatformSelectionState = {
        ...defaultSelection,
        twitter: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={selectedState}
          onToggle={mockOnToggle}
        />
      );

      const twitterButton = screen.getByText("Twitter").closest("button");
      expect(twitterButton).toHaveClass("from-sky-500");
      expect(twitterButton).toHaveClass("to-sky-600");
      expect(twitterButton).toHaveClass("text-white");
    });

    it("shows visual distinction for selected Instagram", () => {
      const selectedState: PlatformSelectionState = {
        ...defaultSelection,
        instagram: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={selectedState}
          onToggle={mockOnToggle}
        />
      );

      const instagramButton = screen.getByText("Instagram").closest("button");
      expect(instagramButton).toHaveClass("from-pink-600");
      expect(instagramButton).toHaveClass("to-purple-600");
      expect(instagramButton).toHaveClass("text-white");
    });

    it("shows visual distinction for selected Blog", () => {
      const selectedState: PlatformSelectionState = {
        ...defaultSelection,
        blog: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={selectedState}
          onToggle={mockOnToggle}
        />
      );

      const blogButton = screen.getByText("Blog").closest("button");
      expect(blogButton).toHaveClass("from-emerald-600");
      expect(blogButton).toHaveClass("to-green-600");
      expect(blogButton).toHaveClass("text-white");
    });

    it("shows visual distinction for mixed selection state", () => {
      const mixedState: PlatformSelectionState = {
        facebook: true,
        linkedin: false,
        twitter: true,
        instagram: false,
        blog: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={mixedState}
          onToggle={mockOnToggle}
        />
      );

      // Selected platforms should have gradient backgrounds
      const facebookButton = screen.getByText("Facebook").closest("button");
      expect(facebookButton).toHaveClass("from-blue-600");

      const twitterButton = screen.getByText("Twitter").closest("button");
      expect(twitterButton).toHaveClass("from-sky-500");

      const blogButton = screen.getByText("Blog").closest("button");
      expect(blogButton).toHaveClass("from-emerald-600");

      // Unselected platforms should have muted backgrounds
      const linkedinButton = screen.getByText("LinkedIn").closest("button");
      expect(linkedinButton).toHaveClass("bg-white/5");

      const instagramButton = screen.getByText("Instagram").closest("button");
      expect(instagramButton).toHaveClass("bg-white/5");
    });

    it("applies pressed state correctly to Toggle component", () => {
      const selectedState: PlatformSelectionState = {
        facebook: true,
        linkedin: false,
        twitter: false,
        instagram: false,
        blog: false,
      };

      render(
        <PlatformSelector
          selectedPlatforms={selectedState}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");
      expect(facebookButton).toHaveAttribute("data-state", "on");

      const linkedinButton = screen.getByText("LinkedIn").closest("button");
      expect(linkedinButton).toHaveAttribute("data-state", "off");
    });
  });

  describe("Accessibility", () => {
    it("renders buttons with proper button role", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(5);
      buttons.forEach((button) => {
        expect(button).toBeInstanceOf(HTMLButtonElement);
      });
    });

    it("buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");

      // Tab to focus the button
      facebookButton!.focus();
      expect(facebookButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard("{Enter}");
      expect(mockOnToggle).toHaveBeenCalledWith("facebook");
    });

    it("all platforms can be toggled independently", async () => {
      const user = userEvent.setup();
      const allSelected: PlatformSelectionState = {
        facebook: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        blog: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={allSelected}
          onToggle={mockOnToggle}
        />
      );

      // All buttons should be in "on" state
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("data-state", "on");
      });

      // Click each to toggle off
      await user.click(screen.getByText("Facebook").closest("button")!);
      await user.click(screen.getByText("LinkedIn").closest("button")!);
      await user.click(screen.getByText("Twitter").closest("button")!);
      await user.click(screen.getByText("Instagram").closest("button")!);
      await user.click(screen.getByText("Blog").closest("button")!);

      expect(mockOnToggle).toHaveBeenCalledTimes(5);
    });
  });

  describe("Edge Cases", () => {
    it("handles all platforms selected", () => {
      const allSelected: PlatformSelectionState = {
        facebook: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        blog: true,
      };

      render(
        <PlatformSelector
          selectedPlatforms={allSelected}
          onToggle={mockOnToggle}
        />
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("text-white");
        expect(button).toHaveAttribute("data-state", "on");
      });
    });

    it("handles no platforms selected", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("bg-white/5");
        expect(button).toHaveAttribute("data-state", "off");
      });
    });

    it("maintains component state after rapid clicks", async () => {
      const user = userEvent.setup();
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const facebookButton = screen.getByText("Facebook").closest("button");

      // Rapidly click the same button multiple times
      await user.click(facebookButton!);
      await user.click(facebookButton!);
      await user.click(facebookButton!);

      expect(mockOnToggle).toHaveBeenCalledTimes(3);
      expect(mockOnToggle).toHaveBeenCalledWith("facebook");
    });
  });

  describe("Layout and Styling", () => {
    it("applies grid layout to platform buttons", () => {
      const { container } = render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-2");
      expect(grid).toHaveClass("md:grid-cols-5");
    });

    it("renders buttons with consistent height", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("h-16");
      });
    });

    it("applies transition classes for smooth state changes", () => {
      render(
        <PlatformSelector
          selectedPlatforms={defaultSelection}
          onToggle={mockOnToggle}
        />
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("transition-all");
        expect(button).toHaveClass("duration-200");
      });
    });
  });
});
