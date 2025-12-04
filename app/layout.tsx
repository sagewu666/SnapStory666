import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapStory - Learn English Through Stories",
  description: "An interactive storytelling app for kids to learn English vocabulary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
