'use client';
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";

function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grow self-stretch inline-flex justify-start items-start">
            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-[30px] w-[75%] h-[calc(100vh-95px)] overflow-y-auto">
                {children}
            </div>
            <div className="p-0 py-[15px] flex flex-col gap-4 bg-white/40 border-white backdrop-blur-lg w-[25%] h-[calc(100vh-95px)] overflow-y-auto">
                <RecordDetailChat customHeight="h-[calc(100vh-125px)]" custopm_width="w-full" />
            </div>
        </div>
    )
}
export default RootLayout;
