"use client";

import { OTC_SESSION_ID } from "@/constants/localStorage";
import { User } from "@/types/authType";
import { getCookie } from "@/utils/cookies";
import { decodeObject } from "@/utils/hasher";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SimpleWebSocket() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const path = usePathname()

  const userCookie = getCookie(OTC_SESSION_ID);
  if (!userCookie) return null;
  const user = decodeObject(userCookie) as User | null;
  if (!user) return null;
  

  useEffect(() => {
    const cleanApiUrl = api_url?.replace(/\/$/, "");
    let wsProtocol = "ws";
    let host = cleanApiUrl || "";
    
    if (host.startsWith("https://")) {
      wsProtocol = "wss";
      host = host.replace("https://", "");
    } else if (host.startsWith("http://")) {
      wsProtocol = "ws";
      host = host.replace("http://", "");
    }

    const socket = new WebSocket(`${wsProtocol}://${host}/ws/otc_flow/`);

    socket.onopen = () => {
      //console.log("✅ Connexion WebSocket ouverte");

      // Envoyer l'ID utilisateur réel
      socket.send(JSON.stringify({
        type: "init",
        userId: user.id,
      }));
    };

    socket.onclose = () => {
      //console.log("❌ WebSocket fermé");
    };

    socket.onerror = (err) => {
      //console.info("Erreur WebSocket :", err);
    };

    return () => {
      socket.close();
    };
  }, [user, path]);

  return null;
}
