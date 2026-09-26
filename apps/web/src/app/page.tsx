import { getPortfolio } from "@/lib/api";
import { PortfolioPage } from "@/components/portfolio-page";
import { VisitTracker } from "@/components/visit-tracker";
import { LandingLoader } from "@/components/landing-loader";

export default async function Home() {
  const portfolio = await getPortfolio();
  return <><LandingLoader /><VisitTracker /><PortfolioPage portfolio={portfolio} /></>;
}
