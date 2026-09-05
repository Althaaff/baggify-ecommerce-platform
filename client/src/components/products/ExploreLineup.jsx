import { GoArrowRight } from "react-icons/go";
import { categoryService } from "../../services/productsService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExploreLineUp = ({ title }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const categoryParams = {
          isActive: true,
          parent: "none",
        };

        const response = await categoryService.getAllCategories(categoryParams);

        if (response.success && Array.isArray(response.data)) {
          setCategories(response.data.slice(0, 4));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 mx-auto max-w-full flex justify-center">
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse ml-4 sm:ml-0" />

          <div className="flex overflow-x-auto md:overflow-x-hidden gap-4 pb-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex-shrink-0 w-[250px] sm:w-[300px] h-[280px] sm:h-[320px] bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="py-8 px-4 sm:px-6 mx-auto max-w-full flex justify-center">
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-[20px] sm:text-3xl text-left text-black font-sans font-bold pl-4 sm:pl-0">
            {title}
          </h2>

          <div className="flex overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory [&::-webkit-scrollbar]:hidden gap-4 pb-4">
            {categories.map((category) => {
              console.log("category", category);
              const imageUrl =
                category.image?.url ||
                category.image ||
                "https://via.placeholder.com/300x320?text=Category";

              const categorySlug =
                category.slug ||
                category.name?.toLowerCase().replace(/\s+/g, "-");

              return (
                <Link
                  to={`/collections/${categorySlug}`}
                  key={category._id || category.id}
                  className="flex-shrink-0 snap-center relative group cursor-pointer block overflow-hidden rounded-lg"
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-[250px] sm:w-[300px] h-[280px] sm:h-[320px] object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center px-5 z-10">
                    <span className="text-base sm:text-lg font-extrabold font-sans text-white drop-shadow-sm">
                      {category.name}
                    </span>
                    <GoArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreLineUp;
