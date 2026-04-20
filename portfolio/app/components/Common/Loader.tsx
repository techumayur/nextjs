"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div className="preloader-container">
      <div className="logo-container">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={150}
          height={60}
          priority
          className="loader-logo"
        />
      </div>

      <style jsx>{`
        .preloader-container {
          position: fixed;
          inset: 0;
          background: var(--body-color, #ffffff);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.4s ease;
        }

        :global([data-theme="dark"]) .preloader-container {
          background: #000000;
        }

        .logo-container {
          animation: pulse 2s ease-in-out infinite;
        }

        .loader-logo {
          width: 150px;
          height: auto;
          display: block;
        }

        :global([data-theme="dark"]) .loader-logo {
          filter: brightness(0) invert(1);
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
