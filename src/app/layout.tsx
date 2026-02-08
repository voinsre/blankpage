import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Blank Page Worth $22.95 | blankpageworth.com",
  description:
    "We're selling you nothing. A blank page. For $22.95. And the fact that this bothers you is exactly why you need it.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1110"
  ),
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    interactiveWidget: "resizes-content",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "A Blank Page Worth $22.95",
    description:
      "The only AI that refuses to think for you. If you don't pay, you won't pay attention.",
    url: "https://blankpageworth.com",
    siteName: "Blank Page Worth",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "A Blank Page Worth $22.95",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Blank Page Worth $22.95",
    description: "The only AI that refuses to think for you.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Blank Page Worth",
              url: "https://blankpageworth.com",
              description:
                "An AI-powered blank page experience that asks questions instead of giving answers.",
              applicationCategory: "LifestyleApplication",
              offers: {
                "@type": "Offer",
                price: "22.95",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${ebGaramond.variable} font-body`}>{children}</body>
    </html>
  );
}
