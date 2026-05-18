import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "@/components/shared/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VeloRent — Premium Car Rental",
    template: "%s | VeloRent",
  },
  description:
    "Premium car rental for those who demand the extraordinary. Browse 500+ vehicles across 50+ cities.",
  keywords: ["car rental", "premium cars", "luxury vehicles", "rent a car"],
  openGraph: {
    title: "VeloRent — Premium Car Rental",
    description: "Drive the future. Premium car rental platform.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B2540] text-white antialiased">
        <SessionProvider>
          {children}
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
