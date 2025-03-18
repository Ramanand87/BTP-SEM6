"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function DynamicFooter() {
  const pathname = usePathname(); // Get current route

  if (pathname === "/chat") {
    return null; // Hide footer on /chat
  }

  return <Footer />;
}
