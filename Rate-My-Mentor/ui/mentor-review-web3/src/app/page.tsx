import { CompanyTopGrid } from "@/components/home/company-top-grid";
import { HomeHero } from "@/components/home/home-hero";
import { MentorTopGrid } from "@/components/home/mentor-top-grid";
import { PlatformFlow } from "@/components/home/platform-flow";
import { MOCK_TOP_COMPANIES, MOCK_TOP_MENTORS } from "@/data/home-mock";

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HomeHero />
      <MentorTopGrid items={MOCK_TOP_MENTORS} />
      <CompanyTopGrid items={MOCK_TOP_COMPANIES} />
      <PlatformFlow />
    </div>
  );
}
