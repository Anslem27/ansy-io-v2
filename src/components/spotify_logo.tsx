"use client";

import React, { useEffect, useState } from "react";

const SpotifyLogo: React.FC = () => {
    const [animationEnded, setAnimationEnded] = useState(false);

    const handleAnimationEnd = () => {
        setAnimationEnded(true);
    };

    return (
        <div
            className={`flex justify-center items-center size-8 ${animationEnded ? "scale-100" : "scale-50"
                }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-24 h-24 text-green-500 transition-all animate-logo`}
                onAnimationEnd={handleAnimationEnd}
            >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-green-500" />

                <path d="M6 10c1.5-.9 3.5-1.4 6-1.4s4.5.5 6 1.4" stroke="black" strokeWidth="1.5" />
                <path d="M6 13c1.5-.9 3.5-1.4 6-1.4s4.5.5 6 1.4" stroke="black" strokeWidth="1.5" />
                <path d="M6 16c1.5-.9 3.5-1.4 6-1.4s4.5.5 6 1.4" stroke="black" strokeWidth="1.5" />
            </svg>
        </div>
    );
};

export default SpotifyLogo;