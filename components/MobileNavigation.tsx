"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

/**
 * The MobileNavigation component renders a mobile navigation menu with a
 * logo, navigation links, file uploader and logout button. The navigation
 * links are rendered as a list of links to the different sections of the
 * application. The file uploader and logout button are rendered as separate
 * components.
 *
 * @param {{ $id: string; accountId: string; fullName: string; avatar: string; email: string; }} props
 * @returns {JSX.Element}
 */
export default function MobileNavigation({
  $id: ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="mobile-header">
      {/* Logo */}
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Search"
            width={30}
            height={30}
          />
        </SheetTrigger>

        <SheetContent className="shad-sheet h-screen px-3">
          {/* Header */}
          <SheetTitle>
            <div className="header-user">
              {/* Avatar */}
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              {/* User Details */}
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          {/* Navigation */}
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }) => (
                <Link key={name} href={url} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active"
                    )}
                  >
                    {/* Icon */}
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
                    {/* Name */}
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          {/* Separator */}
          <Separator className="my-5 bg-light-200/20" />

          {/* File Uploader and Logout */}
          <div className="flex flex-col justify-between gap-5 pb-5">
            {/* File Uploader */}
            <FileUploader ownerId={ownerId} accountId={accountId} />
            {/* Logout */}
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={() => {}}
            >
              {/* Icon */}
              <Image
                src="/assets/icons/logout.svg"
                alt="logo"
                width={24}
                height={24}
              />
              {/* Text */}
              <p>Logout</p>
            </Button>
          </div>

        </SheetContent>
      </Sheet>
    </header>
  );

}
