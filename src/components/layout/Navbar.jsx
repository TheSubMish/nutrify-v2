"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {motion, useScroll,useMotionValueEvent} from 'framer-motion'
import clsx from "clsx"
import HamburgerMenu from "../HamburgerMenu"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const isActive = (href) => pathname === href

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav 
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="sticky top-0 bg-white w-full md:mb-10 lg:px-24 xl:px-40 pt-7 lg:pt-10 pb-5 border-b-2"
    >
      <div className="flex justify-between items-center relative px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl md:text-3xl lg:text-4xl font-bold z-10 gabarito-uniquifier"
        >
          <Image
            src="/logo.png"
            alt="Nutrifyme Logo"
            width={48}
            height={48}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          />
          <span>Nutrifyme</span>
        </Link>

        {/* Hamburger Menu */}
        <div
          className="md:hidden cursor-pointer z-20"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          <HamburgerMenu isOpen={isOpen} />
        </div>

        {/* Navigation Links */}
        <div
          id="navbar-menu"
          className={`absolute top-0 left-0 w-full h-screen bg-white md:static md:w-auto md:h-auto md:flex md:items-center ${
            isOpen ? "flex flex-col justify-center" : "hidden md:flex"
          }`}
        >
          <ul className="flex flex-col md:flex-row text-center w-full md:w-auto md:items-center">
            {/* Home Link */}
            <li className="my-7 md:my-0 md:mx-5">
              <Link
                onClick={closeMenu}
                href="/"
                className={clsx(
                  "text-2xl md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] 2xl:text-xl font-bold link link-underline link-underline-black",
                  isActive("/") ? "text-gray-500" : "text-black",
                )}
              >
                Home
              </Link>
            </li>

            {/* About Link */}
            <li className="my-7 md:my-0 md:mx-5">
              <Link
                onClick={closeMenu}
                href="/about"
                className={clsx(
                  "text-2xl md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] 2xl:text-xl font-bold link link-underline link-underline-black",
                  isActive("/about") ? "text-gray-500" : "text-black",
                )}
              >
                About
              </Link>
            </li>

            {/* Project Link */}
            <li className="my-7 md:my-0 md:mx-5">
              <Link
                onClick={closeMenu}
                href="/contact"
                className={clsx(
                  "text-2xl md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] 2xl:text-xl font-bold link link-underline link-underline-black",
                  isActive("/contact") ? "text-gray-500" : "text-black",
                )}
              >
                Contact
              </Link>
            </li>

            {/* Contact Link */}
            <li className="my-7 md:my-0 md:mx-5">
              <Link
                onClick={closeMenu}
                href="/blog"
                className={clsx(
                  "text-2xl md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] 2xl:text-xl font-bold link link-underline link-underline-black",
                  isActive("/blog") ? "text-gray-500" : "text-black",
                )}
              >
                Blogs
              </Link>
            </li>

            {/* Login Button */}
            <li className="my-7 md:my-0 md:mx-5">
              <Link
                onClick={closeMenu}
                href="/login"
                className="inline-block whitespace-nowrap px-4 py-2 text-base font-semibold rounded-lg text-white btn-primary"
              >
                Log-In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar;