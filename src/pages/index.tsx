import MainLayout from '@/layouts/MainLayout';
import { HeroSection } from '@/components/hero-section';
import { FeaturedProperties } from '@/components/featured-properties';
import { ExclusiveProperties } from '@/components/exclusives-proprierties'
import { FeaturedNeighborhoods } from '@/components/featured-neighborhoods'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

const Home = () => {
  return (
    <>
      <HeroSection />   {/* Slider principal */}
      <ExclusiveProperties /> {/* Propriedades exclusivas */}
      <FeaturedNeighborhoods /> {/* Bairros vizinhos */}
      <FeaturedProperties /> {/* Propriedades principais */}
    </>
  );
};

Home.getLayout = (page: any) => <MainLayout>{page}</MainLayout>;

export default Home;
