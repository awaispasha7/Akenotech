"use client";

import { FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Status = "idle" | "starting" | "waiting" | "done" | "error";

export default function GenerateVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("8");
  const [status, setStatus] = useState<Status>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "waiting" || !jobId) return;

    const es = new EventSource(`/api/generate-video/stream?jobId=${jobId}`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          status: "done" | "error";
          videoUrl?: string;
          error?: string;
        };

        if (data.status === "done") {
          setVideoUrl(data.videoUrl || null);
          setStatus("done");
        } else if (data.status === "error") {
          setErrorMessage(data.error || "Something went wrong.");
          setStatus("error");
        }
      } catch (e) {
        console.error("Failed to parse SSE message", e);
        setErrorMessage("Failed to read server update.");
        setStatus("error");
      } finally {
        es.close();
      }
    };

    es.onerror = () => {
      console.error("SSE connection error");
      setErrorMessage("Connection lost while waiting for the video.");
      setStatus("error");
      es.close();
    };

    return () => {
      es.close();
    };
  }, [status, jobId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setVideoUrl(null);

    if (!prompt.trim()) {
      setErrorMessage("Please enter a prompt.");
      return;
    }

    setStatus("starting");

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, duration }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      type ApiErrorResponse = { error?: string; details?: string };
      if (!res.ok) {
        const data: ApiErrorResponse = await res
          .json()
          .catch(() => ({} as ApiErrorResponse));
        const errorMsg = data.error || "Failed to start video generation.";
        const details = data.details ? ` ${data.details}` : "";
        throw new Error(errorMsg + details);
      }

      const data: { jobId?: string } = await res.json();
      
      if (!data.jobId) {
        throw new Error("Server did not return a job ID. Please check server logs.");
      }

      setJobId(data.jobId);
      setStatus("waiting");
    } catch (err: unknown) {
      console.error("Error starting video generation:", err);
      let message = "Something went wrong.";
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          message = "Request timed out. Please check your n8n webhook configuration.";
        } else {
          message = err.message;
        }
      }
      
      setErrorMessage(message);
      setStatus("error");
    }
  }

  function reset() {
    setPrompt("");
    setDuration("8");
    setJobId(null);
    setVideoUrl(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  const isBusy = status === "starting" || status === "waiting";

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-10">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              AI Video Generation (Beta)
            </h1>
            <p className="text-white/80 max-w-2xl">
              Turn your ideas into short, high-impact videos powered by our
              n8n + Sora pipeline. Submit a prompt and duration, and we&apos;ll
              show your video here once it&apos;s ready.
            </p>
          </header>

          <section>
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 border border-white/15 rounded-2xl p-6 md:p-8 backdrop-blur-md"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Prompt
                  </label>
                  <textarea
                    className="w-full min-h-[140px] rounded-xl bg-black/30 border border-white/20 px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="e.g. A product demo video showing our dashboard revealing insights in real time..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isBusy}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2">
                      Duration (seconds)
                    </label>
                    <select
                      className="w-full md:w-48 rounded-full bg-black/30 border border-white/20 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isBusy}
                    >
                      <option value="4" className="bg-[#050816] text-white">4 seconds</option>
                      <option value="8" className="bg-[#050816] text-white">8 seconds</option>
                      <option value="12" className="bg-[#050816] text-white">12 seconds</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="mt-2 md:mt-7 inline-flex items-center justify-center bg-emerald-500 text-black px-8 py-3 rounded-full font-bold text-base shadow-xl hover:shadow-2xl hover:bg-emerald-400 hover:scale-105 transition-all disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {status === "starting"
                      ? "Starting..."
                      : status === "waiting"
                      ? "Generating..."
                      : "Generate Video"}
                  </button>
                </div>

                {errorMessage && (
                  <div className="rounded-xl bg-red-500/20 border border-red-400/60 text-sm px-4 py-3">
                    {errorMessage}
                  </div>
                )}
              </div>
            </form>
          </section>

          {status === "waiting" && (
            <section>
              <div className="bg-black/40 border border-white/15 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-white/30 border-t-emerald-400 rounded-full animate-spin" />
                <div>
                  <p className="font-semibold">Generating your video...</p>
                  <p className="text-sm text-white/70">
                    This may take a short while depending on your prompt. Keep
                    this tab open, and we&apos;ll stream the result here.
                  </p>
                </div>
              </div>
            </section>
          )}

          {status === "done" && videoUrl && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your video</h2>
              <div className="bg-black/60 border border-white/15 rounded-2xl p-4">
                <video
                  className="w-full max-w-3xl mx-auto rounded-xl shadow-2xl"
                  src={videoUrl}
                  controls
                />
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center border border-white/40 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
              >
                Generate another video
              </button>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


