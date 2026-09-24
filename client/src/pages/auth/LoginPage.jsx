import { ShieldCheck, Truck, RotateCcw, ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { cartApiService } from "../../services/cartServices.js";
import toast from "react-hot-toast";
import { clearGuestSessionId } from "../../utils/guestSession";
import useCart from "../../hooks/useCart.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = email. 2 = otp.
  const [isOtpProcessing, setIsOtpProcessing] = useState(false);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { requestOtp, verifyOtp, googleLogin } = authService;
  const { mergeGuestCart } = cartApiService;
  const { loadCart } = useCart();
  const { login } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsOtpProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await requestOtp(email);
      setSuccess(response.message);
      setStep(2); // move to otp input
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsOtpProcessing(false);
    }
  };

  // redirect user after login success:
  const redirectUser = (userRole) => {
    const returnPath = location.state?.from;

    if (returnPath) {
      navigate(returnPath, { replace: true });
    } else if (userRole === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/orders", { replace: true });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsOtpProcessing(true);
    setError("");

    try {
      const response = await verifyOtp(email, otp);

      // navigate to the admin and orders page based on conditions :
      if (response.success) {
        const { token, user } = response.data;

        // authenticate the user
        login(token, user);

        try {
          await mergeGuestCart();
          clearGuestSessionId();

          // re-load user cart
          loadCart();
        } catch (mergeErr) {
          console.error("cart merge failed", mergeErr);
        }

        // navigates immediately to /checkout if user came from step 1
        redirectUser(user?.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsOtpProcessing(false);
    }
  };

  // google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsGoogleProcessing(true);
      setError("");

      const response = await googleLogin({
        credential: credentialResponse.credential,
      });

      if (response?.success) {
        const { token, user } = response.data;
        const isAdmin = user?.role === "admin";

        // pass token and user :
        login(token, user);

        try {
          await mergeGuestCart();
          clearGuestSessionId();

          // re-load user cart :
          loadCart();
        } catch (mergeErr) {
          console.error("cart merge failed", mergeErr);
        }

        // redirect to login page :
        if (isAdmin) {
          navigate("/admin");
          toast.success("Logged in successfully!");
        } else {
          navigate("/orders");
          toast.success("Logged in successfully!");
        }
      }
    } catch (err) {
      console.error("error", err);
      setError(err.response?.data?.message || "Google login failed");
      setIsGoogleProcessing(false);
    }
  };

  // google login error :
  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            BAGGIFY<span className="text-blue-600">.</span>
          </span>
        </div>
        <a
          href="/"
          className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Back to Shop
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          <div className="hidden md:flex md:col-span-5 bg-blue-600 text-white p-8 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-bold tracking-widest uppercase bg-blue-700/80 px-3 py-1 rounded-full border border-blue-400/30">
                Member Benefits
              </span>
              <h2 className="text-2xl font-black mt-4 leading-snug">
                Log in to unlock exclusive deals
              </h2>
              <p className="text-blue-100 text-xs mt-2 leading-relaxed">
                Track your orders, save items to your wishlist, and enjoy
                seamless one-click checkouts.
              </p>
            </div>

            <div className="space-y-4 relative z-10 py-6 border-y border-blue-500/50 my-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/50 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">Fast & Free Shipping</p>
                  <p className="text-[11px] text-blue-200">
                    On eligible orders over ₹499
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/50 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">10-Day Easy Returns</p>
                  <p className="text-[11px] text-blue-200">
                    No questions asked return policy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">100% Secure Payments</p>
                  <p className="text-[11px] text-blue-200">
                    Encrypted checkout process
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-blue-200 relative z-10">
              Trusted by over 100,000+ happy shoppers.
            </p>
          </div>

          <div className="col-span-1 md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
                <span className="shrink-0">⚠️</span>
                <p className="leading-tight">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2.5">
                <span className="shrink-0">✅</span>
                <p className="leading-tight">{success}</p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Login or Sign Up
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Get instant access to your account with a quick OTP
                    verification.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isOtpProcessing}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isOtpProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <span>Continue with Email</span>
                    )}
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider absolute">
                    OR
                  </span>
                </div>

                <div className="w-full flex justify-center relative">
                  <div
                    className={`w-full shadow-2xs rounded-xl overflow-hidden border border-gray-200 
      ${isGoogleProcessing ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        handleGoogleSuccess(credentialResponse);
                      }}
                      onError={() => {
                        handleGoogleError();
                      }}
                      useOneTap
                      text="continue_with"
                      shape="rectangular"
                      width="100%"
                      click_listener={() => setIsGoogleProcessing(true)}
                    />
                  </div>

                  {isGoogleProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-xs rounded-xl">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <p className="text-center text-[11px] text-gray-400 leading-relaxed pt-2">
                  By continuing, you agree to Baggify's{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Verify Verification Code
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    We sent a 6-digit code to{" "}
                    <span className="font-bold text-gray-900">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      disabled={isOtpProcessing}
                      autoFocus
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 tracking-[0.5em] text-center font-mono font-bold text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isOtpProcessing}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isOtpProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify & Proceed</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email Address</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} Baggify Inc. All rights reserved.
      </footer>
    </div>
  );
}
