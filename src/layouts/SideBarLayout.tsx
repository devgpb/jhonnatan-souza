import { ReactNode } from "react";
import { SideColumn } from "@/components/admin/side-column";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();

  return (
    <>
        <SideColumn />
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname} // Garante que a animação acontece ao trocar de página
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
