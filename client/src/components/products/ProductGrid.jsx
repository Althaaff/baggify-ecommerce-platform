import { useNavigate } from "react-router-dom";

const images = [
  "https://www.furjaden.com/cdn/shop/files/SC05_Maroon_Model.jpg?v=1741627455&width=900",
  "https://www.furjaden.com/cdn/shop/files/BM38_Model_1.1.jpg?v=1741627659&width=900",
  "https://www.furjaden.com/cdn/shop/files/Canvas_Fabric_LowRes.jpg?v=1741682742&width=900",
  "https://www.furjaden.com/cdn/shop/files/PU_BAnner.jpg?v=1741978538&width=900",
];

const categories = [
  { name: "POLYCARBONATE SUITCASES" },
  { name: "VEGAN LEATHER BAGS" },
  { name: "ECO FRIENDLY CANVAS BAGS" },
  { name: "REVERSOFLEX PU BAGS" },
];

const ProductGrid = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/collections/new-launches");
  };
  return (
    <div className="max-w-full mx-auto px-2 py-4">
      <div className="flex justify-start items-center md:px-32 md:py-6 md:pb-8 pb-4 py-4">
        <h2 className="md:text-3xl text-xl font-sans font-semibold">
          Dive Into The Essentials
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-center justify-center relative">
        {images.map((img, i) => (
          <>
            <div className="relative">
              <img
                src={img}
                alt={`Image ${i}`}
                className="w-full h-[400px] object-cover"
              />

              <div className="absolute left-0 right-0 bottom-5 flex justify-center">
                <button
                  onClick={handleNavigate}
                  className="flex px-4 py-2 text-white border-[1px] border-white hover:bg-white/10 hover:transition-all ease-in-out"
                >
                  {categories[i].name}
                </button>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
