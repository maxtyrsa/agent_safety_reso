import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'РЕСО Страхование - Ваш Агент',
  description: 'Персональный сайт страхового агента РЕСО-Гарантия: калькуляторы, услуги и онлайн-заявки.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
