"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Field measurement of Core Web Vitals (LCP, INP, CLS) plus FCP/TTFB from real
 * visitors, beaconed to /api/vitals. Lab scores (Lighthouse) say what *can*
 * happen; this says what *does* happen on visitors' phones.
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      rating: metric.rating,
      id: metric.id,
      path: window.location.pathname,
      nav: metric.navigationType,
    });
    if (!navigator.sendBeacon?.("/api/vitals", new Blob([body], { type: "application/json" }))) {
      fetch("/api/vitals", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
    }
  });
  return null;
}
