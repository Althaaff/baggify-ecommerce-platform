import { useEffect, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useRef } from "react";
import { Link } from "react-router-dom";
// import gsap from "gsap";

const TopBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const messages = [
    "Over 1 Million Happy Customers",
    "5% Additional Discount On Prepaid Orders",
    "Free Shipping on Orders Over $50",
    "24/7 Customer Support for Your Convenience",
    "Satisfaction Guaranteed or Your Money Back",
    "Exclusive Offers for Newsletter Subscribers",
  ];
  let interval = 3000;

  const totalMessages = messages.length;

  let autoSlideInterval = useRef(null);
  let autoSlideTimeOut = useRef(null);

  // if slide is in intial slide which is 0 if user
  // click again ( 0 - 1 = -1 + 2 = 1 --> 1 is last totalMessages index so slide to the last message )
  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalMessages) % totalMessages
    );
    stopAutoSlide();
  };

  // if slide in last slide which index is (1)if length is 2
  // ( 1+1 --> 2%2 --> 0 --> which is first (slide) message in the array )
  const handleNext = () => {
    setCurrentIndex((nextIndex) => (nextIndex + 1) % totalMessages);
    stopAutoSlide();
  };

  // start auto slide :
  function startAutoSlide() {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }

    autoSlideInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % totalMessages;
      });
    }, interval);
  }

  // stop auto slide:
  function stopAutoSlide() {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
      autoSlideInterval.current = null;
    }

    if (autoSlideTimeOut.current) {
      clearTimeout(autoSlideTimeOut.current);
    }

    autoSlideTimeOut.current = setTimeout(() => {
      startAutoSlide();
    }, interval);
  }

  useEffect(() => {
    // console.log("running");
    startAutoSlide();

    // when page mounts cleanup :
    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }

      if (autoSlideTimeOut.current) {
        clearTimeout(autoSlideTimeOut.current);
      }
    };
  }, [totalMessages, interval]);

  return (
    <div className="bg-black">
      <div className="w-full flex items-center justify-center px-4 py-2 min-h-[40px]">
        <div className="flex items-center justify-between w-full gap-4 max-w-md">
          {/* Prev Button: Use <button> instead of <Link> */}
          <button
            onClick={handlePrev}
            className="hover:text-gray-300 p-1 focus:outline-none" // Add focus styles for accessibility
            aria-label="Previous message"
          >
            <GrFormPrevious className="h-5 w-5" />
          </button>
          {/* ... (messages div unchanged) ... */}
          <div className="flex-1 overflow-hidden text-center">
            <div
              className="text-slide flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <span
                    className="w-full flex-shrink-0 text-xs text-white topbar-text"
                    key={i}
                  >
                    {msg}
                  </span>
                ))
              ) : (
                <span className="w-full text-xs text-white">No messages</span>
              )}
            </div>
          </div>
          {/* Next Button: Use <button> instead of <Link> */}
          <button
            onClick={handleNext}
            className="hover:text-gray-300 p-1 focus:outline-none"
            aria-label="Next message"
          >
            <GrFormNext className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
{
  /* Keep messages visible */
}
