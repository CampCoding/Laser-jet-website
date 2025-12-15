"use client";

import useNetworkStatus from "../../../hooks/useNetworkStatus";
import OfflineOverlay from "./OfflineOverlay";
export default function GlobalOfflineGate({ children }) {
  const { isOnline } = useNetworkStatus();
  console.log( "isOnline" ,  isOnline)
  return (
    <>
      {!isOnline && <OfflineOverlay onRetry={() => window.location.reload()} />}
      {children}
    </>
  );
}
