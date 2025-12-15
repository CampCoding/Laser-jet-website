"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export function useSendVerifyCode({
  onSuccess,
  onError,
  cooldownSeconds = 60,
} = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Cooldown state
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startCooldown = useCallback((sec = cooldownSeconds) => {
    clearTimer();
    setSecondsLeft(sec);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, cooldownSeconds]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const sendVerifyCode = useCallback(
    async ({ phone } = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!phone) {
          const err = new Error("Phone is required");
          setError(err);
          onError?.(err);
          throw err;
        }

        const url = `https://lesarjet.camp-coding.site/api/user/send_verify_code?phone=${encodeURIComponent(
          phone
        )}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.success === false) {
          const message = json?.message || "Failed to send verification code";
          const err = new Error(message);
          setError(err);
          onError?.(err);
          throw err;
        }

        setData(json);
        onSuccess?.(json);

        // ✅ ابدأ العداد بعد الإرسال الناجح
        startCooldown(cooldownSeconds);

        return json;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Unexpected error");
        setError(e);
        onError?.(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError, startCooldown, cooldownSeconds]
  );

  // ✅ زرار إعادة إرسال (ممنوع قبل انتهاء العداد)
  const resend = useCallback(
    async ({ phone } = {}) => {
      if (secondsLeft > 0) return; // حماية
      return sendVerifyCode({ phone });
    },
    [sendVerifyCode, secondsLeft]
  );

  // ✅ Reset code button: يمسح errors + data + ويصفر العداد
  const resetCode = useCallback(() => {
    clearTimer();
    setSecondsLeft(0);
    setError(null);
    setData(null);
  }, [clearTimer]);

  // reset عام (زي بتاعك)
  const reset = useCallback(() => {
    setIsLoading(false);
    setData(null);
    setError(null);
    clearTimer();
    setSecondsLeft(0);
  }, [clearTimer]);

  return {
    sendVerifyCode,
    resend,
    resetCode,
    startCooldown,

    isLoading,
    data,
    error,

    secondsLeft,
    canResend: secondsLeft === 0 && !isLoading,

    reset,
  };
}
