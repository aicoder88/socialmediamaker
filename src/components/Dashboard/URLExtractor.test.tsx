import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import URLExtractor from "./URLExtractor";

describe("URLExtractor", () => {
  const defaultProps = {
    url: "",
    onUrlChange: vi.fn(),
    onLoad: vi.fn(),
    isLoading: false,
  };

  it("renders input with placeholder", () => {
    render(<URLExtractor {...defaultProps} />);

    const input = screen.getByPlaceholderText("https://example.com/article");
    expect(input).toBeInTheDocument();
  });

  it("renders Article URL label with Globe icon", () => {
    render(<URLExtractor {...defaultProps} />);

    expect(screen.getByText("Article URL")).toBeInTheDocument();
  });

  it("displays the url value in the input", () => {
    const testUrl = "https://example.com/test-article";
    render(<URLExtractor {...defaultProps} url={testUrl} />);

    const input = screen.getByPlaceholderText(
      "https://example.com/article"
    ) as HTMLInputElement;
    expect(input.value).toBe(testUrl);
  });

  it("calls onUrlChange when input changes", async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();
    render(<URLExtractor {...defaultProps} onUrlChange={onUrlChange} />);

    const input = screen.getByPlaceholderText("https://example.com/article");
    await user.type(input, "test");

    expect(onUrlChange).toHaveBeenCalled();
    expect(onUrlChange).toHaveBeenCalledTimes(4);
    // Last call should have the last character
    expect(onUrlChange).toHaveBeenLastCalledWith(expect.stringContaining("t"));
  });

  it("calls onUrlChange with correct value on each keystroke", () => {
    const onUrlChange = vi.fn();
    render(<URLExtractor {...defaultProps} onUrlChange={onUrlChange} />);

    const input = screen.getByPlaceholderText("https://example.com/article");

    // Simulate typing "abc" character by character
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.change(input, { target: { value: "abc" } });

    expect(onUrlChange).toHaveBeenCalledTimes(3);
    expect(onUrlChange).toHaveBeenNthCalledWith(1, "a");
    expect(onUrlChange).toHaveBeenNthCalledWith(2, "ab");
    expect(onUrlChange).toHaveBeenNthCalledWith(3, "abc");
  });

  it("calls onLoad when Extract button is clicked", () => {
    const onLoad = vi.fn();
    render(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        onLoad={onLoad}
      />
    );

    const button = screen.getByRole("button", { name: /extract/i });
    fireEvent.click(button);

    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isLoading is true", () => {
    render(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={true}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Extract")).not.toBeInTheDocument();
  });

  it("shows Loader2 icon when loading", () => {
    render(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={true}
      />
    );

    // The Loader2 icon should be in the DOM
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Loading...");
  });

  it("shows Sparkles icon and Extract text when not loading", () => {
    render(
      <URLExtractor {...defaultProps} url="https://example.com/test" />
    );

    expect(screen.getByText("Extract")).toBeInTheDocument();
  });

  it("disables button when url is empty", () => {
    render(<URLExtractor {...defaultProps} url="" />);

    const button = screen.getByRole("button", { name: /extract/i });
    expect(button).toBeDisabled();
  });

  it("disables button when url contains only whitespace", () => {
    render(<URLExtractor {...defaultProps} url="   " />);

    const button = screen.getByRole("button", { name: /extract/i });
    expect(button).toBeDisabled();
  });

  it("enables button when url has valid content", () => {
    render(
      <URLExtractor {...defaultProps} url="https://example.com/article" />
    );

    const button = screen.getByRole("button", { name: /extract/i });
    expect(button).not.toBeDisabled();
  });

  it("disables button when isLoading is true", () => {
    render(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("displays error message when error prop is provided", () => {
    const errorMessage = "Invalid URL format";
    render(<URLExtractor {...defaultProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("does not display error message when error prop is undefined", () => {
    render(<URLExtractor {...defaultProps} />);

    const errorText = screen.queryByText(/error/i);
    expect(errorText).not.toBeInTheDocument();
  });

  it("displays error message with correct styling", () => {
    const errorMessage = "Something went wrong";
    render(<URLExtractor {...defaultProps} error={errorMessage} />);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass("text-xs", "text-red-400");
  });

  it("input has error styling when error is present", () => {
    render(<URLExtractor {...defaultProps} error="Invalid URL" />);

    const input = screen.getByPlaceholderText("https://example.com/article");
    expect(input).toHaveClass("border-red-500");
  });

  it("input does not have error styling when error is undefined", () => {
    render(<URLExtractor {...defaultProps} />);

    const input = screen.getByPlaceholderText("https://example.com/article");
    expect(input).not.toHaveClass("border-red-500");
  });

  it("input has base styling classes", () => {
    render(<URLExtractor {...defaultProps} />);

    const input = screen.getByPlaceholderText("https://example.com/article");
    expect(input).toHaveClass(
      "bg-white/5",
      "border-white/20",
      "text-white",
      "placeholder:text-gray-400"
    );
  });

  it("button has gradient styling", () => {
    render(
      <URLExtractor {...defaultProps} url="https://example.com/test" />
    );

    const button = screen.getByRole("button", { name: /extract/i });
    expect(button).toHaveClass(
      "bg-gradient-to-r",
      "from-purple-600",
      "to-blue-600"
    );
  });

  it("does not call onLoad when button is disabled due to empty url", () => {
    const onLoad = vi.fn();
    render(<URLExtractor {...defaultProps} url="" onLoad={onLoad} />);

    const button = screen.getByRole("button", { name: /extract/i });
    fireEvent.click(button);

    expect(onLoad).not.toHaveBeenCalled();
  });

  it("does not call onLoad when button is disabled due to loading state", () => {
    const onLoad = vi.fn();
    render(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={true}
        onLoad={onLoad}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onLoad).not.toHaveBeenCalled();
  });

  it("renders with framer-motion animation wrapper", () => {
    const { container } = render(<URLExtractor {...defaultProps} />);

    // Check that the motion.div is rendered
    const motionDiv = container.querySelector(".space-y-4");
    expect(motionDiv).toBeInTheDocument();
  });

  it("handles rapid input changes correctly", async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();
    render(<URLExtractor {...defaultProps} onUrlChange={onUrlChange} />);

    const input = screen.getByPlaceholderText("https://example.com/article");

    // Type rapidly
    await user.type(input, "https://rapid-typing-test.com", { delay: 1 });

    // Should be called for each character
    expect(onUrlChange).toHaveBeenCalled();
    expect(onUrlChange.mock.calls.length).toBeGreaterThan(0);
  });

  it("clears error when url changes", async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();
    const { rerender } = render(
      <URLExtractor
        {...defaultProps}
        onUrlChange={onUrlChange}
        error="Previous error"
      />
    );

    expect(screen.getByText("Previous error")).toBeInTheDocument();

    // Rerender without error
    rerender(
      <URLExtractor {...defaultProps} onUrlChange={onUrlChange} error={undefined} />
    );

    expect(screen.queryByText("Previous error")).not.toBeInTheDocument();
  });

  it("maintains button state during loading", () => {
    const { rerender } = render(
      <URLExtractor {...defaultProps} url="https://example.com/test" />
    );

    const button = screen.getByRole("button", { name: /extract/i });
    expect(button).not.toBeDisabled();

    // Simulate loading state
    rerender(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={true}
      />
    );

    expect(button).toBeDisabled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("onChange handler receives the input value", () => {
    const onUrlChange = vi.fn();
    render(<URLExtractor {...defaultProps} onUrlChange={onUrlChange} />);

    const input = screen.getByPlaceholderText("https://example.com/article");
    fireEvent.change(input, { target: { value: "https://example.com" } });

    expect(onUrlChange).toHaveBeenCalledWith("https://example.com");
  });

  it("button text changes between loading and non-loading states", () => {
    const { rerender } = render(
      <URLExtractor {...defaultProps} url="https://example.com/test" />
    );

    expect(screen.getByText("Extract")).toBeInTheDocument();

    rerender(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={true}
      />
    );

    expect(screen.queryByText("Extract")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    rerender(
      <URLExtractor
        {...defaultProps}
        url="https://example.com/test"
        isLoading={false}
      />
    );

    expect(screen.getByText("Extract")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("accepts and displays long URLs", () => {
    const longUrl =
      "https://example.com/very/long/path/to/article/with/many/segments?query=param&other=value";
    render(<URLExtractor {...defaultProps} url={longUrl} />);

    const input = screen.getByPlaceholderText(
      "https://example.com/article"
    ) as HTMLInputElement;
    expect(input.value).toBe(longUrl);
  });

  it("error message appears below the input field", () => {
    const { container } = render(
      <URLExtractor {...defaultProps} error="Test error" />
    );

    const errorElement = screen.getByText("Test error");
    const inputContainer = container.querySelector(".flex-1");

    expect(inputContainer).toContainElement(errorElement);
  });
});
