// app/layout.js
import ClientRootLayout from "./ClientRootLayout";
import "./globals.scss";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Client-side logic and UI */}
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
