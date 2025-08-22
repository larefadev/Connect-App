import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Parts Store - Public",
  description: "Public catalog of quality auto parts",
};

export default function PublicStoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="public-store-layout">
            {children}
        </div>
    );
}
