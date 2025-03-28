"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {motion, useScroll,useMotionValueEvent} from 'framer-motion'
import clsx from "clsx"
import HamburgerMenu from "../HamburgerMenu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)
  const toggleDropdown = () => setDropdownOpen((prev) => !prev)

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

  // Get user initials for avatar fallback
  const getUserInitial = () => {
    if (!user) return "?"

    // If user has a name, use first letter of first name
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase()
    }

    // Otherwise use first letter of email
    return user.email?.charAt(0).toUpperCase() || "?"
  }

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
          {/* <Image
            src="/logo.png"
            alt="Nutrifyme Logo"
            width={48}
            height={48}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
          /> */}
          <span className="slackey-regular secondary">Nutrifyme</span>
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

            {/* Blog Link */}
            {/* <li className="my-7 md:my-0 md:mx-5">
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
            </li> */}

            {/* Login Button */}
            {/* Profile or Login */}
            <li className="my-7 md:my-0 md:mx-5">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url || "/placeholder.svg"}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-9 h-9 rounded-full tertiary-bg">
                        {getUserInitial()}
                      </div>
                    )}
                    {/* <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.email}</span>
                    <span className={dropdownOpen ? "▲" : "▼"}></span> */}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut()
                          setUser(null)
                          setDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-center"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  onClick={closeMenu}
                  href="/auth/login"
                  className="inline-block whitespace-nowrap px-4 py-2 text-base font-semibold rounded-lg text-white btn-primary"
                >
                  Log In
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar;