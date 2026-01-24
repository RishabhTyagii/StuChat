import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
      </head>
      <body>
        {/* <Navbar /> */}
        <div style={{ padding:0 }}>{children}</div>
      </body>
    </html>
  );
}
