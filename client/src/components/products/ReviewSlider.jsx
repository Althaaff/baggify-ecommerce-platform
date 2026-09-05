import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import React from "react";
import { useState } from "react";
const reviewsData = [
  {
    id: 1,
    rating: 5,
    text: "This backpack from Baggify features good quality canvas material and vegan leather. The color combination used is of amazing and the bag even has a place to keep your laptop",
    author: "Samantha",
    images: [
      "https://www.furjaden.com/cdn/shop/files/71WiUohWHPL.jpg?crop=center&height=550&v=1714475868&width=550",
    ],
  },
  {
    id: 2,
    rating: 5,
    text: "Super spacious and stylish! Fits my 15-inch laptop comfortably with plenty of room left for books and chargers. Highly recommend for college or daily work.",
    author: "Rahul M.",
    images: [
      "https://www.furjaden.com/cdn/shop/files/IMG05045.jpg?crop=center&height=550&v=1714476137&width=550",
    ],
  },
  {
    id: 3,
    rating: 5,
    text: "The build quality exceeded my expectations. The vegan leather accents give it a premium feel, and the straps are very comfortable for long walks.",
    author: "Ananya S.",
    images: [
      "https://www.furjaden.com/cdn/shop/files/IMG05089.jpg?crop=center&height=550&v=1714476678&width=550",
    ],
  },
];

export const ReviewSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviewsData.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviewsData.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const currentReview = reviewsData[currentIndex];

  return (
    <div className="w-full bg-[#f8f9fa] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-8 md:mb-12 tracking-wide">
          Here’s What The Squad’s Saying!
        </h2>

        <div className="relative flex items-center justify-between gap-4 md:gap-8">
          <button
            onClick={handlePrev}
            aria-label="Preview review"
            className="p-2 text-gray-700 hover:text-black transition-colors focus:outline-none flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-transparent max-w-4xl mx-auto">
            <div className="flex flex-col justify-center space-y-4 text-left">
              <div className="flex items-center space-x-1">
                {[...Array(currentReview.rating)].map((__, i) => (
                  <Star key={i} className="w-4 h-4 fill-black text-black" />
                ))}
              </div>

              <p className="text-gray-800 text-base md:text-lg leading-relaxed font-normal">
                "{currentReview.text}"
              </p>

              <p className="text-sm text-gray-600 font-medium">
                – {currentReview.author}
              </p>
            </div>

            <div className="w-full h-72 md:h-96 bg-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
              {currentReview.images.length > 0 ? (
                <img
                  src={currentReview.images[0]}
                  alt={`Review by ${currentReview.author}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm italic font-medium">
                  Image Placeholder
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            aria-label="Next review"
            className="p-2 text-gray-700 hover:text-black transition-colors focus:outline-none flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
