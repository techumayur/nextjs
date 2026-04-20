"use client";
import { useEffect } from "react";

export default function BootstrapJS() {
  useEffect(() => {
    // @ts-expect-error - bootstrap JS does not have types
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
