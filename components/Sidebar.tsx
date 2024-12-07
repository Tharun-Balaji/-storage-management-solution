"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants";

/**
 * Sidebar component properties.
 *
 * @property {string} fullName - The full name of the user
 * @property {string} avatar - The URL of the user's avatar
 * @property {string} email - The email address of the user
 */
interface Props {
   fullName: string;
   avatar: string;
   email: string;
}

/**
 * The Sidebar component renders a sidebar with a logo, navigation and a user info
 * section. The navigation is a list of links to the different sections of the
 * application. The user info section contains the user's avatar, name and email
 * address.
 *
 * @param {string} fullName - The full name of the user
 * @param {string} avatar - The URL of the user's avatar
 * @param {string} email - The email address of the user
 *
 * @returns The Sidebar component
 */
export default function Sidebar({ fullName, avatar, email }: Props) {

  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active"
                )}
              >
                {/* Navigation icon */}
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active"
                  )}
                />

                {/* Navigation text */}
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      {/* Background image */}
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />

      {/* User info */}
      <div className="sidebar-user-info">
        {/* Avatar */}
        <Image
          src={avatar}
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />

        {/* User name and email */}
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );

}
