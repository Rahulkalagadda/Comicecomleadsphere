"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PodcastSeries, PodcastEpisode } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { checkEntitlement } from "@/lib/api/client";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowLeft,
  Lock,
  Sparkles,
  Clock,
} from "lucide-react";

interface VideoPlayerShellProps {
  series: PodcastSeries;
  episode: PodcastEpisode;
}

export function VideoPlayerShell({ series, episode }: VideoPlayerShellProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isOwned, setIsOwned] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Business Rule: Ep 1 is free, subsequent episodes need verified entitlement
  const isAuthorized = episode.isFree || isOwned;

  useEffect(() => {
    let mounted = true;
    checkEntitlement(episode.id).then((owned) => {
      if (mounted) setIsOwned(owned);
    });
    return () => {
      mounted = false;
    };
  }, [episode.id]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
    }
  }, [episode.id, episode.videoStreamUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link
          href={`/podcasts/${series.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-token hover:text-primary-token"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {series.title}
        </Link>
      </div>

      {/* Video Shell Container */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-theme flex items-center justify-center group"
      >
        {isAuthorized ? (
          <>
            <video
              ref={videoRef}
              src={episode.videoStreamUrl || "/media/videos/clip-01-jungle-is-changing.mp4"}
              poster={episode.thumbnailUrl}
              playsInline
              preload="metadata"
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                const video = e.currentTarget;
                if (!video.dataset.fallbackApplied) {
                  video.dataset.fallbackApplied = "true";
                  video.src = "/media/videos/clip-01-jungle-is-changing.mp4";
                  video.load();
                }
              }}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label={`Play ${episode.title}`}
                className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand/95 hover:bg-brand-hover text-[#07100D] flex items-center justify-center shadow-2xl border-2 border-[#F5C451]/80 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </button>
            )}

            {/* Custom Tactile Overlay Controls */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 sm:p-5 opacity-90 group-hover:opacity-100 transition-opacity flex flex-col gap-3">
              {/* Seek Bar */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#F5C451]"
              />

              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:translate-y-0.5 text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:translate-y-0.5 text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-xs font-medium text-white/90 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg p-1">
                    {[1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSpeedChange(s)}
                        className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded transition-all cursor-pointer ${
                          playbackSpeed === s
                            ? "bg-[#F5C451] text-[#07100D] font-bold shadow-sm"
                            : "text-white/85 hover:text-white"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:translate-y-0.5 text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
                    aria-label="Toggle Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* LOCKED STATE FOR UNPURCHASED EPISODE 2+ */
          <div className="p-8 text-center max-w-md space-y-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F5C451]/15 border border-[#F5C451]/35 flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#F5C451]" />
            </div>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F5C451]/15 text-[#F5C451] border border-[#F5C451]/40">
              Individually Purchasable Episode
            </span>

            <h3 className="text-2xl font-semibold font-serif-editorial tracking-[-0.015em] text-[#F5F1E6]">
              Episode Locked
            </h3>

            <p className="text-sm text-[#B9C8BF] leading-relaxed">
              Episode 1 of this masterclass is free for everyone. Subsequent episodes require individual ownership to unlock verified in-browser streaming.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <AddToCartButton
                size="lg"
                className="sm:w-auto"
                item={{
                  id: episode.id,
                  title: episode.title,
                  type: "podcast_episode",
                  badge: "VIDEO",
                  edition: `${series.title} • ${episode.duration}`,
                  authorOrHost: series.host,
                  tierOrFormat: "HD Studio Video Stream • Synced Notes",
                  price: episode.price,
                  coverUrl: episode.thumbnailUrl,
                }}
              />
              <Button
                variant="accent"
                size="lg"
                onClick={() => setCheckoutOpen(true)}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Unlock for {formatCurrency(episode.price)}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Episode Info & Series Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left: Episode Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={episode.isFree ? "green" : "gold"}>
              {episode.isFree ? "Free Episode" : isAuthorized ? "Owned" : "Paid Episode"}
            </Badge>
            <span className="text-xs font-mono tabular-nums text-muted-token flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {episode.duration}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] leading-[1.18] text-primary-token">
            {episode.title}
          </h2>

          <p className="text-sm sm:text-[15px] text-secondary-token leading-relaxed">
            {episode.description}
          </p>

          <div className="p-4 rounded-xl bg-surface-secondary border border-theme flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={series.coverUrl}
                alt={series.title}
                className="w-12 h-12 rounded-lg object-cover border border-theme"
              />
              <div>
                <p className="text-sm font-heading font-semibold text-primary-token">{series.title}</p>
                <p className="text-xs text-muted-token">Hosted by {series.host}</p>
              </div>
            </div>
          </div>

          {/* 3D Wolf Mascot Audio Companion (Matching Stitch Screen 05) */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-surface-secondary/70 border border-theme/80 soft-surface">
            <div className="w-12 h-12 shrink-0">
              <img
                src="/images/mascot-wolf-transparent.png"
                alt="Wolf audio host with headphones"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-heading font-semibold text-primary-token block">Audio Host Companion • Strategist Wolf</span>
              <span className="text-secondary-token text-xs block leading-relaxed">
                Episode 1 complimentary in 4K • Unlocked episodes synchronized to your personal sanctuary
              </span>
            </div>
          </div>
        </div>

        {/* Right: Series Playlist */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold font-heading text-primary-token uppercase tracking-[0.08em]">
            All Episodes ({series.episodes.length})
          </h3>

          <div className="space-y-2">
            {series.episodes.map((ep) => {
              const isCurrent = ep.id === episode.id;
              return (
                <Link
                  key={ep.id}
                  href={`/episodes/${ep.id}`}
                  className={`block p-3 rounded-xl border transition-all ${isCurrent
                      ? "border-brand bg-brand/5 shadow-sm"
                      : "border-theme bg-surface-primary hover:bg-surface-secondary"
                    }`}
                >
                  <div className="flex gap-3">
                    {ep.videoStreamUrl ? (
                      <video
                        src={`${ep.videoStreamUrl}#t=0.5`}
                        poster={ep.thumbnailUrl}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-16 h-12 rounded-lg object-cover border border-theme bg-[#07100D] shrink-0"
                      />
                    ) : (
                      <img
                        src={ep.thumbnailUrl}
                        alt={ep.title}
                        className="w-16 h-12 rounded-lg object-contain border border-theme bg-[#07100D] shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-[11px] font-semibold text-accent-gold tabular-nums">
                          Ep {ep.episodeNumber}
                        </span>
                        {ep.isFree ? (
                          <span className="font-heading text-[11px] font-semibold bg-[#2CE0C9]/15 text-[#2CE0C9] border border-[#2CE0C9]/30 px-1.5 py-0.5 rounded">
                            FREE
                          </span>
                        ) : (
                          <span className="font-heading text-[11px] font-semibold tabular-nums text-secondary-token">
                            {formatCurrency(ep.price)}
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading text-[13px] font-semibold text-primary-token truncate mt-0.5">
                        {ep.title}
                      </h4>
                      <p className="text-[11px] text-muted-token tabular-nums mt-0.5">{ep.duration}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        item={{
          id: episode.id,
          title: episode.title,
          price: episode.price,
          type: "podcast_episode",
          coverUrl: episode.thumbnailUrl,
        }}
        onSuccess={() => setIsOwned(true)}
      />
    </div>
  );
}
