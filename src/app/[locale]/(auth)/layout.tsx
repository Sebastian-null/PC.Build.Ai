import type { ReactNode } from "react";
import { Link } from "@/shared/i18n/navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="auth-page"><Link href="/" className="wordmark auth-wordmark">PCBuilder<span>AI</span></Link><section className="auth-card">{children}</section></main>;
}
