import React from "react";

export default function Loader() {
  return (
    <>
      <style>
        {`
          @keyframes rotate4 {
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes dash4 {
            0% {
              stroke-dasharray: 1, 200;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 90, 200;
              stroke-dashoffset: -35px;
            }
            100% {
              stroke-dashoffset: -125px;
            }
          }
        `}
      </style>

      <svg
        viewBox="25 25 50 50"
        className="w-[1.5em] h-[1.5em] origin-center animate-[rotate4_2s_linear_infinite]"
      >
        <circle
          r="20"
          cy="50"
          cx="50"
          className="fill-none stroke-[hsl(214,97%,59%)] stroke-2 stroke-linecap-round animate-[dash4_1.5s_ease-in-out_infinite]"
          style={{
            strokeDasharray: "1, 200",
            strokeDashoffset: 0,
          }}
        />
      </svg>
    </>
  );
}
