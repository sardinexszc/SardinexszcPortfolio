import { getPortfolio } from "@/lib/api";
import { PortfolioPage } from "@/components/portfolio-page";
import { VisitTracker } from "@/components/visit-tracker";

export default async function Home() {
  const portfolio = await getPortfolio();
  return <><VisitTracker /><PortfolioPage portfolio={portfolio} /></>;
}