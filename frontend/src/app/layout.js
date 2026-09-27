import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
    title: "TAJVERSE",
    description: "Complete looks for every occasion.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}