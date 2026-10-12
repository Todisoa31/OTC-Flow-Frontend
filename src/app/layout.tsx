import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/providers/Provider";
import { Bounce, ToastContainer, Zoom } from "react-toastify";
import SimpleWebSocket from "@/components/SimpleWebSocket";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "OTC Flow",
    description: "OTC Flow app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body id="otc-body" className={`${geistSans.variable} ${geistMono.variable} bg-[#B4F0E0] text-black`}
            >
                <Provider>
                    {children}
                </Provider>
                
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeButton={true}
                    closeOnClick={true}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Zoom}
                    className={'text-[14px] font-bold text-black-secondary mt-[20px]'}
                />

                <SimpleWebSocket />
            </body>
        </html>
    );
}
