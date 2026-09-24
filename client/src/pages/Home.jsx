import { Loader } from "lucide-react";
import Hero from "../components/layout/Hero.jsx";
import BagCollection from "../components/products/BagCollection.jsx";
import BagsVideoSection from "../components/products/BagVideoSection.jsx";
import ExploreLineUp from "../components/products/ExploreLineup.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import { useFeaturedProducts } from "../hooks/useFeaturedProducts.jsx";
import { useNewArrivalProducts } from "../hooks/useNewArrivals.jsx";
import ProductSkeleton from "../components/products/ProductSkeleton.jsx";

const productImg = [
  "https://www.furjaden.com/cdn/shop/files/Webs1.jpg?v=1755275509&width=1500",
];

const Home = () => {
  const { data: featuredProducts, loading: featuredLoading } =
    useFeaturedProducts();
  const { data: newArrivalProducts, loading: newArrivalsLoading } =
    useNewArrivalProducts();

  return (
    <>
      {/* Hero section */}
      <Hero />
      {featuredLoading && featuredProducts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <ProductSkeleton />
        </div>
      ) : (
        <BagCollection
          products={featuredProducts}
          title={"The GOATS Of Travel"}
        />
      )}

      <div className="py-6">
        {newArrivalsLoading && newArrivalProducts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <ProductSkeleton />
          </div>
        ) : (
          <BagCollection
            products={newArrivalProducts}
            title={"Hot Off The Press"}
            buttonText={"View New Launches"}
          />
        )}
      </div>

      <ExploreLineUp title={"Explore Our Lineup"} />
      <BagsVideoSection />

      {/* Our Obsession */}
      <div className="w-full mx-auto py-16">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-black text-3xl font-semibold font-sans shadow-sm">
            OUR OBSESSION
          </h2>

          <div className="max-w-xl px-6">
            <p className="text-center text-gray-900 font-normal leading-7">
              We craft signature pieces that are young, vibrant and fashionable,
              and yet a celebration of timeless style, luxe and sophistication.
              The finer details of each seam, thread or buckle are obsessed over
              to deliver that perfect finish.
            </p>
          </div>
        </div>
      </div>

      {/* Product img */}
      <div className="max-w-full">
        <div className="relative">
          <img
            className="w-full h-auto object-cover"
            src={productImg[0]}
            alt={`Product Image`}
          />

          <button className="absolute left-4 right-4 bottom-10 mx-auto bg-transparent text-white border-[1px] border-white px-4 py-2 hover:bg-white/20 hover:transition-transform duration-500 transition-all ease-in-out w-fit max-w-[calc(100%-2rem)] text-sm sm:text-base text-ellipsis overflow-hidden whitespace-nowrap">
            BAG OF THE WEEK, FRESH DROP, HOT PICK!
          </button>
        </div>
      </div>
      <ProductGrid />
    </>
  );
};

export default Home;
