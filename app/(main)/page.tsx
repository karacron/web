import { CtaSection } from "@organism/sections/cta";
import { FeatureGrid } from "@organism/sections/feature/grid";
import { FeatureProduct } from "@organism/sections/feature/product";
import { HeroSection } from "@organism/sections/hero";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureProduct />
      {/* <IntegrationsSection /> */}
      <FeatureGrid />
      <CtaSection />
    </>
  );
}
