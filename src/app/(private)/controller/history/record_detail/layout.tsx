'use client';
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";

function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grow self-stretch inline-flex justify-start items-start">
            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-[30px]">
                {children}
            </div>
            <RecordDetailChat />
        </div>
    )
}
export default RootLayout;
