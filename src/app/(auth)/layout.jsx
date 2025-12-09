// app/(auth)/layout.js
import React from "react";
import { AuthShell } from "../../providers/AuthShell";

export default function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}
