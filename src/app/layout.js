import './globals.css';

export const metadata = {
  title: 'CampusConnect - Campus Skill and Service Exchange System',
  description: 'Connect, teach, and learn with peers across your college campus. Built by CodeMates for Advanced Java / Web Programming.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

