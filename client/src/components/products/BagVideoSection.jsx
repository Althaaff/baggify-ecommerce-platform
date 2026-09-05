import bagsVideo from "../../assets/bags.mp4";

const BagsVideoSection = () => {
  return (
    <div className="py-4 max-w-full mx-auto">
      <div className="w-full h-[400px] sm:h-[700px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={bagsVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default BagsVideoSection;
