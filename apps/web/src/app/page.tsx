import { getPortfolio } from "@/lib/api";
import { PortfolioPage } from "@/components/portfolio-page";

export default async function Home() {
  const portfolio = await getPortfolio();
  return <PortfolioPage portfolio={portfolio} />;
}