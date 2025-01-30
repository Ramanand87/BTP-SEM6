import { Inter } from "next/font/google";
import { Poppins } from "@next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "./redux-provider";
import { Navbar } from "@/components/Navbar/Navbar";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KitchenConn",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <ReduxProvider>
          <Navbar/>
          <main className="">{children}</main>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
