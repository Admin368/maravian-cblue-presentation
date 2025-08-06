import MalawiNav from "@/components/malawi-nav";
export default function GameLayout({
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
