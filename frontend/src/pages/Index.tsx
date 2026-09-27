import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { WorkflowSection } from "@/components/home/WorkflowSection";
import { StatsSection } from "@/components/home/StatsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <WorkflowSection />
    </Layout>
  );
};

export default Index;
