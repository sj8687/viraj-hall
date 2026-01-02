"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaBirthdayCake,
  FaRing,
  FaHeart,
  FaUsers,
  FaGlassCheers,
  FaBaby,
  FaBriefcase,
} from "react-icons/fa";

const categories = [
  { title: "Birthday", icon: <FaBirthdayCake size={30} /> },
  { title: "Wedding", icon: <FaRing size={30} /> },
  { title: "Anniversary", icon: <FaHeart size={30} /> },
  { title: "Pre-Wedding", icon: <FaGlassCheers size={30} /> },
  { title: "Cultural Event", icon: <FaUsers size={30} /> },
  { title: "Baby Shower", icon: <FaBaby size={30} /> },
  { title: "Engagement", icon: <FaRing size={30} /> },
  { title: "Corporate Event", icon: <FaBriefcase size={30} /> },
];

const InfiniteIconScroll = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isCloned, setIsCloned] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isCloned) return;

    const items = scroller.querySelectorAll(".scroll-item");
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      scroller.appendChild(clone);
    });

    setIsCloned(true);
  }, [isCloned]);

  return (
    <div className="w-full overflow-hidden mt-20 px-4 sm:px-8">
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollerRef}
          className="flex w-max gap-8 sm:gap-16 animate-iconScroll"
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="scroll-item flex flex-col items-center min-w-[80px] sm:min-w-[100px]"
            >
              <div className="mb-2 text-orange-500">{cat.icon}</div>
              <span className="text-gray-700 text-xs sm:text-sm font-semibold text-center">
                {cat.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes iconScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-iconScroll {
          animation: iconScroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InfiniteIconScroll;
