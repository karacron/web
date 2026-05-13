import { CtaSection } from '@organism/sections/cta';
import { FeatureContent } from '@organism/sections/feature/content';
import { FeatureGrid } from '@organism/sections/feature/grid';
import { FeatureProduct } from '@organism/sections/feature/product';
import { HeroSection } from '@organism/sections/hero';

export default function Home() {
	return (
		<>
			<HeroSection />
			<FeatureProduct />
			<FeatureGrid />
			<FeatureContent />
			<CtaSection />
		</>
	);
}
