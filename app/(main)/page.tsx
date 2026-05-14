import { CtaSection } from "@organism/sections/cta";
import { FeatureGrid } from "@organism/sections/feature/grid";
import { FeatureProduct } from "@organism/sections/feature/product";
import { FunctionGrid } from "@organism/sections/function/grid";
import { HeroSection } from "@organism/sections/hero";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureProduct />
      <FeatureGrid />
      <CtaSection />
      <FunctionGrid />
    </>
  );
}
