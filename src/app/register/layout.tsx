import { ToastProvider } from "@/components/providers/ToastProvider";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
