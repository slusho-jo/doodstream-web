import "./globals.css";

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { SITENAME } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: SITENAME,
    description: `${SITENAME} is a video sharing platform that allows users to upload, watch, and share videos.`,
    metadataBase: new URL("http://localhost:3000/"),
};

export const runtime = "edge";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(
                font.className,
                "min-h-screen bg-background font-sans antialiased"
            )}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative flex min-h-screen flex-col">
                        <main className="flex-1">{children}</main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
