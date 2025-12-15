"use client";

import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Alert, Typography, Space } from "antd";
import { useSendVerifyCode } from "../../../hooks/useSendVerify";

const { Text } = Typography;

export default function VerifyOtpModal({
  open,
  onClose,
  phone,
  token,
  onVerified, // callback بعد النجاح (مثلاً refresh profile)
}) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  const { sendVerifyCode, isLoading } = useSendVerifyCode({
    onSuccess: (res) => message.success(res?.message || "تم إرسال الرمز"),
    onError: (err) => message.error(err.message),
  });
  
  useEffect(() => {
    if (open && phone) {
      sendVerifyCode({ phone });
    }
  }, [open, phone]);
  


  const refs = useRef([]);

  useEffect(() => {
    if (!open) return;
    // reset عند الفتح
    setOtp(["", "", "", ""]);
    setError("");
    setSuccess(false);

    // فوكس أول خانة
    setTimeout(() => refs.current?.[0]?.focus?.(), 50);
  }, [open]);

  const close = () => {
    if (loading) return;
    onClose?.();
  };

  const setDigit = (i, v) => {
    const digit = String(v ?? "").replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);

    if (digit && i < 3) refs.current?.[i + 1]?.focus?.();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs.current?.[i - 1]?.focus?.();
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text") || "";
    const digits = text.replace(/\D/g, "").slice(0, 4).split("");
    if (!digits.length) return;

    e.preventDefault();
    const next = ["", "", "", ""];
    for (let i = 0; i < 4; i++) next[i] = digits[i] || "";
    setOtp(next);

    const lastIndex = Math.min(digits.length, 4) - 1;
    if (lastIndex >= 0) refs.current?.[lastIndex]?.focus?.();
  };

  const submit = async () => {
    setError("");
    setSuccess(false);

    const code = otp.join("");
    if (code.length !== 4) {
      setError("من فضلك أدخل كود التوثيق المكوّن من 4 أرقام.");
      return;
    }
    if (!phone) {
      setError("رقم الهاتف غير متوفر.");
      return;
    }

    setLoading(true);
    try {
      const url = `https://lesarjet.camp-coding.site/api/user/verify_code?phone=${encodeURIComponent(
        phone
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ confirm_code: Number(code) }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "فشل التوثيق، حاول مرة أخرى.");
      }

      setSuccess(true);

      await onVerified?.(data);

      // اقفل بعد لحظة
      setTimeout(() => onClose?.(), 800);
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء التوثيق.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      centered
      destroyOnClose
      title="توثيق الحساب"
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Text type="secondary">
          أدخل كود التوثيق المكوّن من 4 أرقام للرقم: <Text strong>{phone || "-"}</Text>
        </Text>

        {error && <Alert type="error" message={error} showIcon />}
        {success && <Alert type="success" message="تم توثيق الحساب بنجاح ✅" showIcon />}

        <div
          dir="ltr"
          style={{ display: "flex", gap: 10, justifyContent: "center" }}
          onPaste={onPaste}
        >
          {otp.map((d, i) => (
            <Input
              key={i}
              value={d}
              ref={(el) => (refs.current[i] = el)}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              style={{
                width: 54,
                height: 54,
                textAlign: "center",
                fontSize: 20,
                fontWeight: 800,
                borderRadius: 12,
              }}
            />
          ))}
        </div>

        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={submit}
          disabled={loading}
        >
          تأكيد التوثيق
        </Button>

        <Button block onClick={close} disabled={loading}>
          إلغاء
        </Button>
      </Space>
    </Modal>
  );
}
