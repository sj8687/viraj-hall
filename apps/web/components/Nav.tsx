"use client";

import Link from "next/link";
import { HiBars3 } from "react-icons/hi2";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Profile } from "./Profile";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: authData, status } = useSession();

  console.log(authData);

  const pathname = usePathname();

  const t1 = useRef<gsap.core.Timeline | null>(null);
  const [scrolled, setScrolled] = useState(false);

  function handleClick() {
    document.body.classList.add("overflow-hidden");
    t1.current?.play();
  }

  function hidediv() {
    document.body.classList.remove("overflow-hidden");
    t1.current?.reverse();
  }


  // animation
  useEffect(() => {
    if (!t1.current) {
      t1.current = gsap.timeline({ paused: true });

      t1.current.to("#mobile-menu", {
        right: 0,
        duration: 0.5,
      });

      t1.current.from("#mobile-menu-text", {
        x: "10px",
        duration: 0.1,
        opacity: 0,
        stagger: 0.1,
      });
    }

    gsap.from(".logo", {
      y: -100,
      duration: 0.7,
      opacity: 0,
      delay: 0.2,
      stagger: 0.1

    });

    gsap.from(".signbarsdiv", {
      y: -100,
      duration: 0.7,
      opacity: 0,
      delay: 0.4,
      stagger: 0.1


    });
    gsap.from(".menus", {
      y: -100,
      duration: 0.7,
      opacity: 0,
      delay: 0.3,
      stagger: 0.1
    });

    // Scroll listener
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);


  }, []);



  // cursor animation

  useEffect(() => {
    const cursor = document.querySelector(".cursor");

    if (!cursor) return;

    const move = (x: number, y: number) => {
      gsap.to(cursor, {
        x,
        y,
        duration: 0.7,
        ease: "back.out",
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      move(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        move(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);


  const isActive = (route: string) => pathname === route;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/nav/gallery", label: "Gallery" },
    { href: "/nav/services", label: "Services" },
    { href: "/nav/contact", label: "Contact" },
    { href: "/nav/about", label: "About Us" },
  ];

  const alwaysShadowRoutes = [
    "/nav/gallery",
    "/nav/contact",
    "/nav/services",
    "/nav/about",
    "/booking/dashboard",
    "/booking/payment",
    "/booking/admin",
    "/booking/Show",
    "/nav/bug"
  ];

  const alwaysShadow = alwaysShadowRoutes.includes(pathname);

  return (
    <section className="main">
      <div className="hidden md:block">
        <div className="cursor pointer-events-none z-[9999] h-[22px] w-[22px]  shadow-[0_0_10px_rgba(900,00,00,1000)] bg-fuchsia-800  rounded-full fixed top-0 left-0"></div>
      </div>
      <div
        className={`flex justify-between sm:mx-0 px-2 md:px-14 md:justify-around backdrop-blur-[10px] z-50 fixed top-0 left-0 right-0 mx-auto items-center md:p-0 transition-all duration-300 ${alwaysShadow || scrolled
          ? "bg- shadow-lg"
          : "bg-transparent shadow-lg sm:shadow-none  backdrop-blur-[10px]"
          }`}
      >
        <div className="logo">
          <Link href={"/"}>
            <Image
              src="/logoo.png"
              alt="Viraj Hall"
              width={125} // max width (responsive handled by Tailwind)
              height={50} // use approx height or tune it
              className="object-cover w-[110px] sm:w-[116px] h-auto rounded-xl"
            />
          </Link>
        </div>

        <div className="text-start px-2 p-4  hidden md:flex flex-1 justify-center gap-8 text-[17px] font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              className={`hover:shadow-lg px-4 py-1 hover:bg-gray-100 hover:rounded-lg menus ${isActive(href)
                ? "underline decoration-2 underline-offset-8"
                : ""
                }`}
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="space-x-2 sm:space-x-3 flex justify-center menus items-center">
          {/* Only render after session is loaded */}
          {status === "loading" ? null : (
            <>
              {authData && authData.user?.role !== "admin" && (
                <Link href="/booking/Show">
                  <button className="bg-black signbarsdiv text-[15px] p-2 px-4 border font-medium hover:border-blue-500 text-white rounded-lg">
                    Bookings
                  </button>
                </Link>
              )}

              {authData && authData.user?.role === "admin" && (
                <Link href="/AdminDash/Admin">
                  <button className="bg-black signbarsdiv text-[15px] p-2 px-4 border font-medium hover:border-red-500 text-white rounded-lg">
                    Admin Panel
                  </button>
                </Link>
              )}

              {authData ? (
                <Profile authData={authData.user} />
              ) : (
                <Link href={"/login"}>
                  <button className="bg-black signbarsdiv p-2 px-4 border font-medium hover:border-red-500 text-white rounded-lg">
                    Log in
                  </button>
                </Link>
              )}
            </>
          )}
          <div
            onClick={handleClick}
            className="w-[30px] text-[26px] font-bold flex items-center justify-center md:hidden cursor-pointer menus"
          >
            <HiBars3 />
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className="fixed mt-0 top-0 border font-medium z-50 right-[-90%] bg-white flex flex-col p-0 h-full w-[260px] pt-32 items-center gap-4 text-[16px] rounded-lg"
      >
        <p
          onClick={() => hidediv()}
          className="absolute top-0 right-0 px-3 rounded-xl p-1 mr-4 mt-4 font-medium text-black bg-orange-300 cursor-pointer"
        >
          X
        </p>

        {navLinks.map(({ href, label }) => (
          <Link suppressHydrationWarning
            key={href}
            id="mobile-menu-text"
            href={href}
            onClick={() => hidediv()}
            className={`tracking-widest rounded-lg transition-shadow duration-100 hover:text-white hover:bg-orange-400 px-12 p-2 barsmenus ${pathname === href ? 'underline decoration-2 underline-offset-8 hover:text-white' : ''
              }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
