import type React from "react";
import type { Metadata } from "next";
import MalawiNav from "@/components/malawi-nav";

export const metadata: Metadata = {
  title: "English Program - Malawi Cultural Presentation",
  description:
    "Interactive Malawi cultural presentation by Paul for students preparing for international work and travel",
};

export default function MalawiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MalawiNav />
      <div className="pt-16">{children}</div>
    </>
  );
}
