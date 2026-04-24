import "./globals.css";

export const metadata = {
  title: "SRM Full Stack Challenge",
  description: "show nodes and relationships",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
