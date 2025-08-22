import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Parts Store",
  description: "Quality auto parts for your vehicle",
};

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="store-layout">
            {children}
        </div>
    );
}
