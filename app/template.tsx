import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function Template({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <Navbar />
            <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
                {children}
            </div>
            <Footer />
            <Toaster position="top-right" />
        </main>
    );
}
