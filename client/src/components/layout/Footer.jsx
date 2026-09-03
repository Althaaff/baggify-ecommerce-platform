import { useState } from "react";

const Footer = () => {
  const links = [
    "Contact Us",
    "Return Policy",
    "Our Story",
    "Privacy Policy",
    "Terms & Conditions",
    "Jaden Rewards",
    "Careers",
  ];

  const accordionData = [
    {
      title: "DELIVERY & SHIPPING",
      content:
        "We ship all orders within 24 Hours of confirmation. We provide free shipping across India and all orders will be delivered within 3-5 Days.",
    },
    {
      title: "Links",
      content: [...links],
    },
  ];

  // console.log(accordionData[1].content);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-full bg-black">
      <div className="w-full py-20 md:px-40">
        {/* mobile screens */}
        <div className="md:hidden block">
          {accordionData.map((item, index) => {
            return (
              <div className="border-b border-gray-500 w-full" key={index}>
                <div
                  className={`flex justify-between items-center gap-5 p-4 cursor-pointer transition-colors duration-200`}
                  onClick={() => handleToggle(index)}
                  role="button"
                  aria-expanded={activeIndex === index}
                  aria-controls={`section-${index}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleToggle(index)}
                >
                  <h2 className="text-sm font-sans text-white font-medium">
                    {item.title}
                  </h2>
                  <span className="text-2xl text-gray-600 font-extrabold">
                    {activeIndex === index ? "-" : "+"}
                  </span>
                </div>

                {activeIndex === index && (
                  <div
                    id={`section-${index}`}
                    className="p-4 bg-black text-white flex flex-col items-start justify-center gap-2"
                  >
                    {Array.isArray(item.content) ? (
                      item.content.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={typeof link === "object" ? link.url : "#"}
                          className="transition-colors"
                        >
                          {typeof link === "object" ? link.text : link}
                        </a>
                      ))
                    ) : (
                      <span>{item.content}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* larger screens */}
        <div className="hidden md:flex justify-center items-start gap-56 py-6">
          <div className="py-2 hidden md:block">
            <div className="flex flex-col items-start gap-4 justify-start">
              <span className="text-white text-sm font-sans">
                DELIVERY & SHIPPING
              </span>
              <p className="max-w-3xl text-gray-500 text-start">
                We ship all orders within 24 Hours of confirmation.
                <br />
                We provide free shipping across India.
                <br />
                All orders will be delivered within 3-5 Days.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <span className="text-white cursor-pointer">Links</span>
            {links.map((link) => (
              <span className="text-gray-400 cursor-pointer hover:underline hover:transition-all ease-linear">
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
