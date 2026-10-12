"use client";

import { OTC_SESSION_ID } from "@/constants/localStorage";
import { User } from "@/types/authType";
import { getCookie } from "@/utils/cookies";
import { decodeObject } from "@/utils/hasher";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MessageType } from "@/types/conversationType";

export function useChatSocket({
    dossierId,
    dossierConversationType,
    receiverId,
    onMessageReceived,
}: {
    dossierId?: number;
    dossierConversationType?: string;
    receiverId?: number;
    onMessageReceived: (message: MessageType) => void;
}) {
    const wsRef = useRef<WebSocket | null>(null);
    const path = usePathname();

    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const userCookie = getCookie(OTC_SESSION_ID);
    const user = userCookie ? (decodeObject(userCookie) as User | null) : null;

    let wsProtocol = "ws";
    let host = api_url?.replace(/\/$/, "") || "";

    if (host.startsWith("https://")) {
        wsProtocol = "wss";
        host = host.replace("https://", "");
    } else if (host.startsWith("http://")) {
        wsProtocol = "ws";
        host = host.replace("http://", "");
    }

    useEffect(() => {
        if (!user) {
            console.log("❌ WS: Utilisateur non authentifié.");
            return;
        }

        let wsUrl = "";

        if (dossierId && dossierConversationType) {
            wsUrl = `${wsProtocol}://${host}/ws/otc_flow/dossier/${dossierId}/${dossierConversationType}/`;
        } else if (receiverId && user.id) {
            const lower = Math.min(user.id, receiverId);
            const higher = Math.max(user.id, receiverId);
            wsUrl = `${wsProtocol}://${host}/ws/otc_flow/user/${lower}/${higher}/`;
        } else {
            // ✅ Pas d'erreur console si pas encore prêt, silencieux
            return;
        }

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("✅ WS connecté :", wsUrl);
            ws.send(
                JSON.stringify({
                    type: "init",
                    userId: user.id,
                })
            );
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "new_message") {
                    onMessageReceived(data.message);
                }
            } catch (error) {
                console.log("❌ Erreur de parsing WS:", error);
            }
        };

        ws.onerror = (err) => {
            console.log("❌ WS Error :", err);
        };

        ws.onclose = (e) => {
            console.log("❌ WS fermé :", e.reason);
        };

        return () => {
            ws.close();
        };
    }, [dossierId, dossierConversationType, receiverId, onMessageReceived, user, path, wsProtocol, host]);
}
