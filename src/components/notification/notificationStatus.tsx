type Props = {
    status: "read" | "unread";
}

export default function NotificationStatus({status = "unread"}: Props) {
    return (
        <div className={`w-3.5 h-3.5 left-[-5px] top-[20px] absolute ${status === "read" ? "bg-[#BFC6D5]":"bg-primary-green"} rounded-full border-2 border-white`} />
    )
};