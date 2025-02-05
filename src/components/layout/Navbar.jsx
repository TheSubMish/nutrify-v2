"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import HamburgerMenu from "../HamburgerMenu" // Ensure this path is correct

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const isActive = (href) => pathname === href

  return (
    <nav className="sticky top-0 bg-white w-full md:mb-10 lg:px-24 xl:px-40 pt-7 lg:pt-10 pb-5">
      <div className="flex justify-between items-center relative px-6 md:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-4xl md:text-[4vw] lg:text-[3vw] xl:text-[2.5vw] 2xl:text-4xl font-bold z-10 mx-auto md:mx-0 gabarito-uniquifier"
        >
          Nutrifyme
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
                href="/project"
                className={clsx(
                  "text-2xl md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] 2xl:text-xl font-bold link link-underline link-underline-black",
                  isActive("/project") ? "text-gray-500" : "text-black",
                )}
              >
                Project
              </Link>
            </li>

            {/* Contact Link */}
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

            {/* Login Button */}
            <li className="my-7 md:my-0 md:mx-5">
              <Link
                onClick={closeMenu}
                href="/login"
                className="px-6 py-2 text-lg md:text-[1.8vw] lg:text-[1.3vw] xl:text-[1vw] 2xl:text-lg font-semibold rounded-full text-white btn-primary"
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;