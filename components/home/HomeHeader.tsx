"use client";

import { motion } from "motion/react";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function HomeHeader() {
  return (
    <motion.header
      className="text-center mb-6 sm:mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
        🌤️ 날씨 앱
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        대한민국 지역의 날씨를 확인하세요
      </p>
    </motion.header>
  );
}
