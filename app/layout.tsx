import type { Metadata } from "next";
import "./globals.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1D4ED8"
    },
    secondary: {
      main: "#3B82F6"
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif"
  }
});

export const metadata: Metadata = {
  title: "Производство ТСЗП",
  description: "Планирование и управление маршрутными картами"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
