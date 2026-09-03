import ImageCarausel from "../common/ImageCarausel";

// slider images :
const images = [
  "https://www.furjaden.com/cdn/shop/files/Batmmancollectionbanner.jpg?v=1777829006&width=1400",
  "https://www.furjaden.com/cdn/shop/files/website_banner_2_copy_b326b17e-1de9-48fa-92d7-280369da932d.jpg?v=1773684646&width=2800",
  "https://www.furjaden.com/cdn/shop/files/sc05ban_e6715b04-e5f7-4b49-8a8d-efaeb5a367a2.jpg?v=1767726786&width=2600",
  "https://www.furjaden.com/cdn/shop/files/BBL00979_W_0f5ac1dc-13db-4f9b-b67b-3a85d3d55d74.jpg?v=1767726850&width=2600",
  "https://www.furjaden.com/cdn/shop/files/pad_web_8fb1c47e-9b3c-4092-be87-06f8450f6559.jpg?v=1773684606&width=2800",
];

const Hero = () => {
  return (
    <div className="w-full mx-auto relative md:-mt-[7.8rem] -mt-[4rem]">
      <ImageCarausel images={images} />
    </div>
  );
};

export default Hero;
