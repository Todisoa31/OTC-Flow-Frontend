import MessagingPage from "@/components/administrator/messaging/messagingPage";
import { MessagingProvider } from "@/contexts/Messaging/MessagingContext";

export default function Messagerie() {
    return (
            <MessagingProvider>
                <MessagingPage/>
            </MessagingProvider>

    )
}