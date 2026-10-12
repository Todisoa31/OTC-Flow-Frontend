import { useEffect, useRef } from "react";

type WebSocketHookParams = {
  url: string; // URL WebSocket complète (ex: wss://example.com/ws/...)
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  initPayload?: any; // Optionnel : données à envoyer à l'ouverture (ex: { type: "init" })
};

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  initPayload,
}: WebSocketHookParams) {

  const wsRef = useRef<WebSocket | null>(null);
  const api_url = process.env.NEXT_PUBLIC_API_URL;
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
    if (!url) return;

    const ws = new WebSocket(`${wsProtocol}://${host}/${url}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS connecté :", `${wsProtocol}://${host}/${url}`);
      if (initPayload) {
        ws.send(JSON.stringify(initPayload));
      }
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (err) {
        console.error("❌ Erreur parsing message :", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket erreur :", err);
      onError?.(err);
    };

    ws.onclose = (event) => {
      console.warn("❌ WS fermé :", event.reason);
      onClose?.(event);
    };

    return () => {
      ws.close();
    };
  }, [url, onMessage, onOpen, onClose, onError, initPayload]);
}
