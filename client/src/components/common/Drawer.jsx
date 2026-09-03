import { X } from "lucide-react";
import { useEffect } from "react";

const Drawer = ({ isOpen, onClose, position = "right", title, children }) => {
  // lock body scroll + esc to close
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    if (isOpen) window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const isRight = position === "right";

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* panel */}
      <aside
        className={[
          "fixed top-0 bottom-0 bg-white shadow-xl transition-transform duration-300 will-change-transform",
          // responsive width (fixes mobile)
          "w-[92vw] max-w-[92vw] sm:w-[420px] sm:max-w-md",
          // position
          isRight ? "right-0" : "left-0",
          // slide animation
          isOpen
            ? "translate-x-0"
            : isRight
              ? "translate-x-full"
              : "-translate-x-full",
          // layout
          "flex flex-col",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-black hover:bg-gray-100"
            aria-label="Close drawer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2">{children}</div>
      </aside>
    </div>
  );
};

export default Drawer;
