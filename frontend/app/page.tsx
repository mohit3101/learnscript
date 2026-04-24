import Hero from "@/components/homepage/Hero";
import HowItWorks from "@/components/homepage/HowItWorks";
import Features from "@/components/homepage/Features";
import UseCases from "@/components/homepage/UseCases";
import Footer from "@/components/homepage/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav className="navbar" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.25rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "var(--r-md)", background: "var(--brand)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--fg)" }}>LearnScript</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ThemeToggle />
          <Link href="/app">
            <button className="btn-primary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.825rem" }}>
              Open App →
            </button>
          </Link>
        </div>
      </nav>

      {/* Homepage sections */}
      <Hero />
      <HowItWorks />
      <Features />
      <UseCases />
      <Footer />
    </div>
  );
}
