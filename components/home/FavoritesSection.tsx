"use client";

import { motion } from "motion/react";
import { FavoritesList } from "@widgets/favorites-list";

export default function FavoritesSection() {
  return (
    <motion.section
      className="mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <FavoritesList />
    </motion.section>
  );
}
