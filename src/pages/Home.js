import React from "react";
import HeroSection from "../components/HeroSection";
import PopularListings from "../components/PopularListings";
import AllListingsSection from "../components/AllListingsSection";
import PromoSection from "./PromoSection";

function Home() {
  return (
    <>
      <HeroSection />
      <PopularListings />
      <AllListingsSection />
      <PromoSection />
    </>
  );
}

export default Home;
