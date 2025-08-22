import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Mi tienda",
  description: "Tienda de productos",
};

export default function StoreNameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="store-name-layout">
            {children}
        </div>
    );
}
