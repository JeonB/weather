"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SearchBar } from "@widgets/search-bar";
import type { ParsedLocation } from "@shared/lib/korea-districts";

export default function SearchSection() {
  const router = useRouter();

  function handleSelectLocation(location: ParsedLocation) {
    const encodedLocation = encodeURIComponent(location.fullName);
    router.push(`/location/${encodedLocation}`);
  }

  return (
    <motion.section
      className="mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <SearchBar
        onSelectLocation={handleSelectLocation}
        className="max-w-xl mx-auto"
      />
    </motion.section>
  );
}
