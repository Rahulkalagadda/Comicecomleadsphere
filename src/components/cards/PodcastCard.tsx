"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PodcastSeries } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Film, PlayCircle, Sparkles } from "lucide-react";

export interface PodcastCardProps {
  series: PodcastSeries;
}

export function PodcastCard({ series }: PodcastCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const firstEpisode = series.episodes[0];

  return (
    <div className="group flex flex-col rounded-xl bg-surface-primary border border-theme/80 soft-surface overflow-hidden transition-all duration-200 hover:-translate-y-1">
      {/* Cinematic 16:9 Studio Video Preview Frame (Real Video Frame, Not Cropped Comic Strip) */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#07100D]">
        {firstEpisode?.videoStreamUrl && !videoFailed ? (
          <video
            src={`${firstEpisode.videoStreamUrl}#t=0.5`}
            poster={series.coverUrl}
            preload="metadata"
            muted
            playsInline
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : !imageFailed && series.coverUrl ? (
          <img
            src={series.coverUrl}
            alt={series.title}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-contain bg-[#07100D] transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0D1B16] to-[#07100D] text-center">
            <Film className="w-10 h-10 text-[#DFB260] mb-2" />
            <span className="font-heading text-xs font-semibold text-white/90 line-clamp-1">{series.title}</span>
          </div>
        )}

        {/* Cinematic gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
          {series.featured && (
            <Badge variant="gold" className="shadow-sm">
              <Sparkles className="w-3 h-3 mr-1" /> Featured
            </Badge>
          )}
          <Badge variant="green" className="shadow-sm">
            Ep 1 Free Video
          </Badge>
        </div>

        {/* Hover tactile Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="w-12 h-12 rounded-full nm-button bg-surface-primary/95 text-primary-token flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            <PlayCircle className="w-6 h-6 text-brand-token" />
          </div>
        </div>

        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#07100D]/85 border border-[#F5C451]/35 backdrop-blur-md text-[11px] font-semibold text-[#F5F1E6] flex items-center gap-1.5 z-10 tabular-nums">
          <Film className="w-3 h-3 text-[#F5C451]" />
          <span>{series.episodeCount} Masterclasses</span>
        </div>
      </div>

      {/* Series Metadata */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <span className="font-heading text-[11px] uppercase tracking-[0.08em] font-semibold text-brand-token block mb-1.5">
            {series.category}
          </span>

          <Link href={`/podcasts/${series.slug}`} className="focus:outline-none block">
            <h3 className="font-heading font-semibold text-base sm:text-[17px] text-primary-token line-clamp-2 leading-[1.32] tracking-[-0.015em] group-hover:text-brand-token transition-colors">
              {series.title}
            </h3>
          </Link>

          <p className="text-[13px] text-secondary-token mt-1.5">Hosted by {series.host}</p>
          <p className="text-[13px] text-muted-token mt-2 line-clamp-2 leading-relaxed">
            {series.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3.5 mt-3 border-t border-theme-subtle flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-token font-medium">
            Ep 1 Free • Series in 4K
          </span>

          <div className="flex items-center gap-1.5">
            {firstEpisode && (
              <Link href={`/episodes/${firstEpisode.id}`}>
                <Button variant="primary" size="sm" className="text-xs px-3">
                  <PlayCircle className="w-3.5 h-3.5" />
                  Watch Ep 1
                </Button>
              </Link>
            )}
            <Link href={`/podcasts/${series.slug}`}>
              <Button variant="secondary" size="sm" className="text-xs px-2.5">
                Series
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
