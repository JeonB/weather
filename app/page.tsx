import HomeHeader from "@/components/home/HomeHeader";
import SearchSection from "@/components/home/SearchSection";
import CurrentLocationWeather from "@/components/home/CurrentLocationWeather";
import FavoritesSection from "@/components/home/FavoritesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <HomeHeader />
        <SearchSection />
        <div className="space-y-5">
          <CurrentLocationWeather />
          <FavoritesSection />
        </div>
      </div>
    </div>
  );
}
