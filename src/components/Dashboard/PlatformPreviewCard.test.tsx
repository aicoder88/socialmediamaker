import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PlatformPreviewCard from "./PlatformPreviewCard";

describe("PlatformPreviewCard", () => {
  it("renders platform name correctly", () => {
    render(
      <PlatformPreviewCard
        platform="twitter"
        content="Test content for Twitter"
      />
    );

    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("displays content preview", () => {
    const testContent = "This is my test content for the platform";
    render(<PlatformPreviewCard platform="facebook" content={testContent} />);

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("shows character count correctly", () => {
    const content = "Hello World"; // 11 characters
    render(<PlatformPreviewCard platform="twitter" content={content} />);

    expect(screen.getByText(/11 \/ 280/)).toBeInTheDocument();
  });

  it("shows percentage usage", () => {
    render(
      <PlatformPreviewCard
        platform="twitter"
        content={"x".repeat(140)}
      />
    );

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("truncates content when exceeding limit", () => {
    const longContent = "x".repeat(300); // Exceeds Twitter's 280 limit
    render(<PlatformPreviewCard platform="twitter" content={longContent} />);

    const preview = screen.getByText(/x+\.\.\./);
    expect(preview).toBeInTheDocument();
  });

  it("displays blog title when provided", () => {
    render(
      <PlatformPreviewCard
        platform="blog"
        content="Blog content here"
        title="My Blog Post Title"
      />
    );

    expect(screen.getByText("My Blog Post Title")).toBeInTheDocument();
  });

  it("shows 'No content to preview' when content is empty", () => {
    render(<PlatformPreviewCard platform="facebook" content="" />);

    expect(screen.getByText("No content to preview")).toBeInTheDocument();
  });

  it("uses custom character limit when provided", () => {
    const content = "x".repeat(50);
    render(
      <PlatformPreviewCard
        platform="twitter"
        content={content}
        characterLimit={100}
      />
    );

    expect(screen.getByText(/50 \/ 100/)).toBeInTheDocument();
  });

  it("shows near limit indicator when above 90%", () => {
    const content = "x".repeat(260); // ~93% of 280
    render(<PlatformPreviewCard platform="twitter" content={content} />);

    expect(screen.getByText("Near limit")).toBeInTheDocument();
  });
});
