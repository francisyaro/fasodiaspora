import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import VideoModal from "@/components/VideoModal";
import PWARegister from "@/components/PWARegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Faso Diaspora | Le Journal de la Communauté Burkinabè",
    template: "%s | Faso Diaspora"
  },
  description: "Faso Diaspora est le portail d'information de référence de la communauté burkinabè à l'étranger. Retrouvez l'actualité politique, économique, sociale, culturelle et sportive du Burkina Faso.",
  keywords: ["Burkina Faso", "Faso Diaspora", "Actualité Burkinabè", "Diaspora", "Ouagadougou", "FESPACO", "SIAO", "Étalons"],
  authors: [{ name: "Faso Diaspora Team" }],
  metadataBase: new URL("https://faso-diaspora.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Faso Diaspora | Le Journal de la Communauté Burkinabè",
    description: "Portail d'information de référence de la communauté burkinabè à l'étranger. Actualités, analyses, débats.",
    url: "https://faso-diaspora.vercel.app",
    siteName: "Faso Diaspora",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Faso Diaspora",
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faso Diaspora | Le Journal de la Communauté Burkinabè",
    description: "Portail d'information de référence de la communauté burkinabè à l'étranger.",
    images: ["https://images.unsplash.com/photo-1594911773752-ea82b4b4b4b4?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash dark mode script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <VideoModal />
        <PWARegister />
      </body>
    </html>
  );
}
