import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: "Nutrifyme - AI Application",
  description: "Get personalized diet suggestion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
