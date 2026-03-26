"use client";

import type { OpenClawPackage } from "@/lib/types";
import { X, ExternalLink, Check, Play } from "lucide-react";

interface PackageDetailModalProps {
  pkg: OpenClawPackage;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export default function PackageDetailModal({
  pkg,
  isSelected,
  onSelect,
  onClose,
}: PackageDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-card md:h-[90vh] md:max-h-[700px] md:max-w-2xl md:rounded-2xl md:border md:shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 md:px-6">
          <div>
            <h2 className="text-base font-semibold md:text-lg">{pkg.name}</h2>
            <p className="mt-0.5 text-xs text-muted">${pkg.price}/mo</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* YouTube Video */}
          <div className="relative w-full bg-black aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${pkg.youtubeId}?rel=0`}
              title={`${pkg.name} - Tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="flex flex-col gap-6 p-5 md:p-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                About
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {pkg.longDescription}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Features
              </h3>
              <ul className="mt-2 flex flex-col gap-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                      <Check className="h-2.5 w-2.5 text-foreground" />
                    </div>
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{pkg.name}</p>
                  <p className="mt-0.5 text-xs text-muted">Monthly subscription</p>
                </div>
                <p className="text-2xl font-bold">
                  ${pkg.price}
                  <span className="text-sm font-normal text-muted">/mo</span>
                </p>
              </div>
            </div>

            {/* Docs link */}
            <a
              href={pkg.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View full documentation
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t px-5 py-4 md:px-6">
          <button
            onClick={onClose}
            className="h-9 flex-1 rounded-lg border text-xs font-medium transition-colors hover:bg-background"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSelect();
              onClose();
            }}
            className={`h-9 flex-1 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? "border border-red-200 text-red-500 hover:bg-red-50"
                : "bg-foreground text-accent-foreground hover:opacity-90"
            }`}
          >
            {isSelected ? "Remove Package" : "Select Package"}
          </button>
        </div>
      </div>
    </div>
  );
}
