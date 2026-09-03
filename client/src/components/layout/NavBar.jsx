import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { PiShoppingCartSimple } from "react-icons/pi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Drawer from "../common/Drawer";
import CartContents from "../cart/CartContents";
import SearchDrawer from "../search/SearchDrawer";
import { categoryService } from "../../services/productsService";
import useCart from "../../hooks/useCart";
import { useDispatch, useSelector } from "react-redux";
import { closeCartDrawer, openCartDrawer } from "../../features/cart/cartSlice";
import { authService } from "../../services/authService";
import {
  getCachedCategories,
  setCachedCategories,
} from "../../services/categoryCache.js";

const STEP = 120;

const NavBar = () => {
  const [categories, setCategories] = useState(() => {
    return getCachedCategories();
  });
  const [translateX, setTranslateX] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);

  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartCount } = useCart();
  const isCartDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);
  const location = useLocation();
  const { logoutUser } = authService;

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const handleSearchDrawerOpen = () => setSearchDrawerOpen(true);

  const handleLogout = (e) => {
    e.stopPropagation();
    setUser(null);
    setIsMobileMenuOpen(false);
    logoutUser(() => navigate("/login"));
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\//g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const measure = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerWidth = container.getBoundingClientRect().width;
    const contentWidth = content.scrollWidth;

    const max = Math.max(contentWidth - containerWidth, 0);
    setMaxTranslate(max);
  }, []);

  // measure after categories render (async load)
  useLayoutEffect(() => {
    measure();
  }, [measure, categories]);

  // re-measure whenever container/content size changes (not only window resize)
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    ro.observe(content);

    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    setTranslateX((prev) => Math.min(prev, maxTranslate));
  }, [maxTranslate]);

  const canPrev = translateX > 0;
  const canNext = translateX < maxTranslate;
  const showArrows = maxTranslate > 0; // hide both if no overflow at all

  const handlePrev = () => {
    setTranslateX((prev) => Math.max(prev - STEP, 0));
  };

  const handleNext = () => {
    setTranslateX((prev) => Math.min(prev + STEP, maxTranslate));
  };

  const handleUserNavigation = () => {
    const user = localStorage.getItem("user");
    navigate(user ? "/orders" : "/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("error", error);
        setUser(storedUser);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname, isMobileMenuOpen]);

  useEffect(() => {
    if (isCartDrawerOpen || isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCartDrawerOpen, isMobileMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success && Array.isArray(response.data)) {
          setCategories(response.data);
          setCachedCategories(response.data);
        }
      } catch (error) {
        console.log("fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="w-full z-40">
        <nav className="w-full py-4 px-6 bg-black transition-all duration-300 ease-in-out relative z-40">
          <div className="hidden md:flex flex-col items-center gap-4">
            <Link
              to="/"
              className="text-2xl .ibm-plex-serif-extralight text-white text-center"
            >
              Baggify
            </Link>

            <div className="flex items-center justify-between gap-6 w-full max-w-6xl">
              <IoSearch
                className="w-6 h-6 cursor-pointer"
                onClick={handleSearchDrawerOpen}
              />

              <button
                onClick={handlePrev}
                disabled={!canPrev}
                className={[
                  "p-2 bg-transparent",
                  !showArrows ? "invisible" : "",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                <GrFormPrevious className="w-7 h-7 text-white" />
              </button>

              <div className="flex-1 overflow-hidden" ref={containerRef}>
                <div
                  className="flex gap-6 whitespace-nowrap transition-transform duration-300 ease-in-out"
                  ref={contentRef}
                  style={{ transform: `translateX(-${translateX}px)` }}
                >
                  {categories.map((item) => (
                    <Link
                      key={item._id || item.name}
                      to={
                        item.name === "Home"
                          ? "/"
                          : `/collections/${slugify(item.name)}`
                      }
                      className="relative text-lg ibm-plex-serif-light text-white hover:text-gray-300 group"
                    >
                      {item.name}
                      <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!canNext}
                className={[
                  "p-2 bg-transparent",
                  !showArrows ? "invisible" : "",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                <GrFormNext className="w-7 h-7 text-white" />
              </button>

              <div className="flex items-center gap-6">
                <button onClick={handleUserNavigation}>
                  <LuUser className="w-6 h-6 text-white cursor-pointer" />
                </button>

                {user && user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    title="Admin Panel"
                  >
                    <MdOutlineAdminPanelSettings className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
                  </button>
                )}

                <button
                  className="relative"
                  onClick={() => dispatch(openCartDrawer())}
                >
                  <PiShoppingCartSimple className="w-6 h-6 text-white" />
                  <span className="absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-white text-black w-5 h-5 text-xs">
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* mobile navbar */}
          <div className="md:hidden flex justify-between items-center">
            <button
              type="button"
              className="p-1 z-50 text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <HiXMark className="w-8 h-8 text-white cursor-pointer" />
              ) : (
                <HiBars3 className="w-8 h-8 text-white cursor-pointer" />
              )}
            </button>

            <Link
              onClick={() => setIsMobileMenuOpen(false)}
              to="/"
              className="text-2xl font-sans font-normal text-white"
            >
              Baggify
            </Link>

            <div className="flex items-center gap-4">
              <IoSearch
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setSearchDrawerOpen(true);
                }}
                className="w-6 h-6 text-white cursor-pointer"
              />
              <button
                className="relative"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  dispatch(openCartDrawer());
                }}
              >
                <PiShoppingCartSimple className="w-6 h-6 text-white" />
                <span className="absolute -top-2 -right-3 flex items-center justify-center rounded-full bg-white text-black w-5 h-5 text-xs">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* mobile menu */}
      <div className="md:hidden">
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`fixed inset-0 w-full h-full bg-black/60 transition-opacity duration-300 z-30 ${
            isMobileMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        />

        <div
          className={`fixed left-0 right-0 top-[115px] bottom-0 bg-black text-white border-t border-white/15 transition-all duration-300 ease-in-out z-40 flex flex-col ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 pointer-events-none invisible"
          }`}
        >
          <div className="flex-1 px-6 py-2 overflow-y-auto min-h-0">
            {categories.map((item) => (
              <Link
                key={item._id || item.name}
                onClick={() => setIsMobileMenuOpen(false)}
                to={
                  item.name === "Home"
                    ? "/"
                    : `/collections/${slugify(item.name)}`
                }
                className="block py-4 border-b border-white/10 uppercase tracking-widest text-xs font-medium text-white hover:text-gray-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 px-6 py-6 bg-black mt-auto safe-bottom">
            <div className="flex items-center space-x-3 text-sm text-white">
              <LuUser className="w-5 h-5 text-white" />
              {user ? (
                <div className="flex items-center gap-1">
                  <span
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/orders");
                    }}
                    className="cursor-pointer hover:underline font-medium"
                  >
                    My Account
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 underline text-xs ml-1"
                  >
                    (Logout)
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="cursor-pointer hover:underline font-medium tracking-wide"
                >
                  Register / Login
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isCartDrawerOpen}
        onClose={() => dispatch(closeCartDrawer())}
        position={"right"}
        title={"Your Cart"}
        className="overflow-hidden"
      >
        <div className="overflow-y-auto h-full pb-32">
          <CartContents />
        </div>
      </Drawer>

      <Drawer
        isOpen={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
        position={"left"}
      >
        <SearchDrawer onClose={() => setSearchDrawerOpen(false)} />
      </Drawer>
    </>
  );
};

export default NavBar;
