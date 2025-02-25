import { ReactNode } from 'react';

interface SimpleLayoutProps {
  children: ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <main>{children}</main>
  );
}
