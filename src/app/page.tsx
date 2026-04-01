"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { llmify, getTypingChunks } from "@/lib/llmify";

const EXAMPLE_INPUTS = [
  "idk man, I've been coding for 10 years and this is the worst API I've ever used. The docs are garbage and nobody cares about backwards compatibility anymore.",
  "This game sucks. I hate the new update, the devs are idiots and clearly never play their own game. Waste of time.",
  "AITA for telling my roommate their cooking is terrible? They keep making disgusting food and the whole apartment smells awful. I can't even.",
  "Just lost my job and tbh I'm feeling pretty bad about it. Maybe I should switch careers entirely. smh at this economy.",
  "ngl this is the most overrated movie ever. mid af. the whole theater was boring. whoever recommended this on r/movies lied to us. 0/10",
  "TIFU by mass replying-all to the entire company. tldr I called my boss a clown and now HR wants to talk. bruh.",
  "ELI5 why can't we just print more money? Seems like an ez fix tbh. Any tips?",
];

const FAKE_STEPS = [
  "Analyzing sentiment vectors... 🔍",
  "Calibrating enthusiasm matrix... 📊",
  "Injecting positivity tokens... 💉✨",
  "Optimizing emoji density... 🎯",
  "Running through 847 billion parameters... 🧠",
  "Maximizing helpfulness score... 📈",
  "Generating response... 🚀",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  const processText = useCallback(() => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setOutput("");
    setTokenCount(0);

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < FAKE_STEPS.length) {
        setProcessingStep(FAKE_STEPS[stepIndex]);
        stepIndex++;
      }
    }, 200);

    setTimeout(() => {
      clearInterval(stepInterval);
      setProcessingStep("");

      const result = llmify(input);
      const chunks = getTypingChunks(result, 2);

      let currentText = "";
      let chunkIndex = 0;

      const typeChunk = () => {
        if (chunkIndex < chunks.length) {
          const chunk = chunks[chunkIndex];
          currentText += chunk;
          setOutput(currentText);
          setTokenCount((prev) => prev + chunk.split(/\s+/).length);
          chunkIndex++;
          typingRef.current = setTimeout(typeChunk, 15 + Math.random() * 25);
        } else {
          setIsProcessing(false);
        }
      };

      typeChunk();
    }, FAKE_STEPS.length * 200 + 300);
  }, [input, isProcessing]);

  const handleExample = (example: string) => {
    setInput(example);
    setOutput("");
    setTokenCount(0);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleClear = () => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setInput("");
    setOutput("");
    setTokenCount(0);
    setIsProcessing(false);
    setProcessingStep("");
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="bg-grid min-h-screen relative">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="neon-badge"
              style={{
                background: "rgba(255, 45, 135, 0.15)",
                border: "1px solid rgba(255, 45, 135, 0.3)",
                color: "var(--neon-pink)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--neon-green)",
                  display: "inline-block",
                  animation: "blink 1.5s step-end infinite",
                }}
              />
              MODEL ONLINE
            </span>
            <span
              className="neon-badge"
              style={{
                background: "rgba(0, 240, 255, 0.1)",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                color: "var(--neon-cyan)",
              }}
            >
              v4.2.0-enthusiastic
            </span>
          </div>

          <h1
            className="text-5xl sm:text-7xl font-black mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="neon-text-pink">Reddit</span>
            <span className="neon-text-cyan">GPT</span>
            <span className="text-xl sm:text-2xl align-super opacity-60">
              {" "}™
            </span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(232, 232, 240, 0.5)" }}
          >
            Transform any Reddit comment into a hyper-enthusiastic,
            emoji-saturated, aggressively helpful LLM response.
            <br />
            <span className="neon-text-pink text-sm">
              No AI harmed in this process. 🤖
            </span>
          </p>
        </header>

        {/* Main card */}
        <div className="glass-card p-5 sm:p-8 animate-fade-in-up delay-2">
          {/* Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--neon-cyan)" }}
              >
                📝 Original Reddit Post/Comment
              </label>
              <span
                className="text-xs"
                style={{ color: "rgba(232, 232, 240, 0.3)" }}
              >
                {input.length} chars
              </span>
            </div>
            <textarea
              className="neon-textarea w-full p-4 text-sm sm:text-base"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a Reddit comment here... or try one of the examples below ↓"
              disabled={isProcessing}
            />
          </div>

          {/* Examples */}
          <div className="mb-6">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "rgba(232, 232, 240, 0.3)" }}
            >
              Try an example:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_INPUTS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(example)}
                  disabled={isProcessing}
                  className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 disabled:opacity-30"
                  style={{
                    background: "rgba(176, 38, 255, 0.1)",
                    border: "1px solid rgba(176, 38, 255, 0.25)",
                    color: "rgba(232, 232, 240, 0.6)",
                  }}
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              className="neon-button px-6 sm:px-8 py-3 text-sm sm:text-base flex-1 sm:flex-none"
              onClick={processText}
              disabled={mounted && (!input.trim() || isProcessing)}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "🤖 LLM-ify It!"
              )}
            </button>
            <button
              className="px-4 py-3 rounded-xl text-sm transition-all hover:scale-105"
              onClick={handleClear}
              style={{
                background: "rgba(232, 232, 240, 0.05)",
                border: "1px solid rgba(232, 232, 240, 0.1)",
                color: "rgba(232, 232, 240, 0.5)",
              }}
            >
              Clear
            </button>
          </div>

          {/* Processing bar */}
          {isProcessing && processingStep && (
            <div className="mb-6 animate-fade-in-up">
              <div className="processing-bar mb-2" />
              <p
                className="text-xs font-mono"
                style={{ color: "var(--neon-cyan)" }}
              >
                {processingStep}
              </p>
            </div>
          )}

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--neon-pink)" }}
              >
                🤖 LLM-ified Response
              </label>
              <div className="flex items-center gap-3">
                {tokenCount > 0 && (
                  <span
                    className="text-xs font-mono token-flash"
                    style={{ color: "var(--neon-green)" }}
                  >
                    {tokenCount} tokens
                  </span>
                )}
                {output && !isProcessing && (
                  <button
                    onClick={handleCopy}
                    className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
                    style={{
                      background: showCopied
                        ? "rgba(57, 255, 20, 0.15)"
                        : "rgba(232, 232, 240, 0.05)",
                      border: showCopied
                        ? "1px solid rgba(57, 255, 20, 0.3)"
                        : "1px solid rgba(232, 232, 240, 0.1)",
                      color: showCopied
                        ? "var(--neon-green)"
                        : "rgba(232, 232, 240, 0.5)",
                    }}
                  >
                    {showCopied ? "Copied! ✓" : "Copy 📋"}
                  </button>
                )}
              </div>
            </div>
            <div
              ref={outputRef}
              className={`output-area p-4 text-sm sm:text-base max-h-[400px] overflow-y-auto ${
                !output && !isProcessing
                  ? "flex items-center justify-center"
                  : ""
              } ${isProcessing && !output ? "cursor-blink" : ""}`}
              style={{ minHeight: 200 }}
            >
              {output ? (
                <span style={{ whiteSpace: "pre-wrap" }}>{output}</span>
              ) : isProcessing ? (
                <span
                  className="font-mono text-sm"
                  style={{ color: "rgba(232, 232, 240, 0.3)" }}
                >
                  Generating enthusiastic response
                </span>
              ) : (
                <span style={{ color: "rgba(232, 232, 240, 0.15)" }}>
                  Your LLM-ified output will appear here ✨
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs animate-fade-in-up delay-3">
          {[
            { label: "Parameters", value: "847B", icon: "🧠" },
            { label: "Enthusiasm", value: "∞", icon: "🔥" },
            { label: "Helpfulness", value: "11/10", icon: "🤗" },
            { label: "Emoji Density", value: "MAX", icon: "✨" },
            { label: "Accuracy", value: "Yes", icon: "🎯" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-1.5"
              style={{ color: "rgba(232, 232, 240, 0.3)" }}
            >
              <span>{stat.icon}</span>
              <span
                className="font-semibold"
                style={{ color: "rgba(232, 232, 240, 0.5)" }}
              >
                {stat.value}
              </span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center animate-fade-in-up delay-4">
          <p
            className="text-xs"
            style={{ color: "rgba(232, 232, 240, 0.2)" }}
          >
            RedditGPT™ is a parody. No actual AI was used. Happy April Fools! 🎉
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(232, 232, 240, 0.12)" }}
          >
            Powered by 0 GPUs, 0 training data, and 100% string manipulation.
          </p>
        </footer>
      </div>
    </div>
  );
}
