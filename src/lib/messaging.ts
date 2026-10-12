import { getToken, onMessage, getMessaging, Messaging } from "firebase/messaging";
import { firebaseApp } from "./firebase"; // ajustez ce chemin selon votre projet

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// ⚠️ Initialise messaging uniquement côté client
let messaging: Messaging | null = null;
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  try {
    messaging = getMessaging(firebaseApp);
  } catch (err) {
    console.error("Erreur d'initialisation Firebase Messaging :", err);
  }
}

export async function requestPermission(): Promise<string | undefined> {
  try {
    if (!messaging) {
      throw new Error("Firebase messaging is not initialisé (client uniquement).");
    }

    const token = await getToken(messaging, { vapidKey });
    if (token) {
      return token;
    } else {
      console.warn("Aucun token disponible. L'utilisateur a peut-être refusé la permission.");
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du token FCM :", err);
  }
}

export function onForegroundNotification(callback: (payload: any) => void): void {
  if (!messaging) {
    console.error("Firebase messaging est indisponible (non initialisé ou serveur).");
    return;
  }

  onMessage(messaging, (payload) => {
    callback(payload);
  });
}
