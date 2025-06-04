import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { HomeProvider } from "@/contexts/HomeContext";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cozy Home",
  description: "Your perfect home companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <HomeProvider>
              <div className="flex min-h-screen flex-col">
                {children}
                <Footer />
              </div>
            </HomeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
