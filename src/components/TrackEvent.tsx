"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function TrackEvent({ name, properties }: { name: string; properties?: any }) {
  useEffect(() => {
    posthog.capture(name, properties);
  }, [name, JSON.stringify(properties)]);

  return null;
}
