import "./globals.css";

export const metadata = {
  title: "Nutrifyme - AI Application",
  description: "Get personalized diet suggestion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
