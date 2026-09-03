import { useEffect, useRef, useState, useCallback } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const ImageCarousel = ({ images, interval = 4000 }) => {
  const total = images.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const timerRef = useRef(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const resetAutoSlide = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPreviousIndex(currentIndexRef.current);
      setCurrentIndex((i) => (i + 1) % total);
    }, interval);
  }, [interval, total]);

  useEffect(() => {
    resetAutoSlide();
    return () => clearInterval(timerRef.current);
  }, [resetAutoSlide]);

  const goTo = (index) => {
    setPreviousIndex(currentIndex);
    setCurrentIndex(((index % total) + total) % total);
    resetAutoSlide();
  };

  const handleNext = () => goTo(currentIndexRef.current + 1);
  const handlePrev = () => goTo(currentIndexRef.current - 1);

  return (
    <div className="relative overflow-hidden w-full h-[700px] sm:h-[95vh] z-20 group bg-black">
      {images.map((img, index) => {
        const isActive = index === currentIndex && mounted;
        const isPrevious = index === previousIndex;

        return (
          <img
            key={img + index}
            src={img}
            alt={`Slide-${index}`}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-700 ease-in-out
              ${
                isActive
                  ? "opacity-100 z-20"
                  : isPrevious
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
              }`}
          />
        );
      })}

      <div className="absolute inset-0 bg-black/10 pointer-events-none z-30" />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center gap-6 px-4 py-2.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-lg z-40 transition-all duration-300 group-hover:scale-[1.02]">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white outline-none"
          aria-label="Previous slide"
        >
          <GrFormPrevious className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 justify-center">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 outline-none ${
                currentIndex === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white outline-none"
          aria-label="Next slide"
        >
          <GrFormNext className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
