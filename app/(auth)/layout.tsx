/**
 * Layout component for the authentication pages.
 *
 * This component will render the children components between the logo and the
 * background image.
 */
import Image from 'next/image';
import React from 'react';

/**
 * The Layout component renders the children components between the logo and
 * the background image. It is designed to be used as a parent component for
 * the authentication pages.
 *
 * The component is split into two sections. The first section is the logo
 * section, which is hidden on small screens and visible on large screens. The
 * second section is the form section, which is visible on small screens and
 * centered on large screens.
 *
 * The component uses Tailwind CSS classes to style the elements. The
 * component's styles can be customized by overriding the classes in the
 * tailwind.config.js file.
 *
 * @param children - The children components that will be rendered between the
 * logo and the background image.
 * @returns The Layout component with the children components rendered between
 * the logo and the background image.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex min-h-screen">
        {/* Logo section, hidden on small screens, visible on large screens. */}
        <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
          <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="logo"
              width={224}
              height={82}
              className="h-auto"
            />

            <div className="space-y-5 text-white">
              <h1 className="h1">Manage your files the best way</h1>
              <p className="body-1">
                This is a place where you can store all your documents.
              </p>
            </div>

            <Image
              src="/assets/images/files.png"
              alt="Files"
              width={342}
              height={342}
              className="transition-all hover:rotate-2 hover:scale-105"
            />
          </div>
        </section>

        {/* Form section, visible on small screens, centered on large screens. */}
        <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
          <div className="mb-16 lg:hidden">
            <Image
              src="/assets/icons/logo-full-brand.svg"
              alt="logo"
              width={224}
              height={82}
              className="h-auto w-[200px] lg:w-[250px]"
            />
          </div>

          {children}
        </section>
      </div>
    </div>
  );
}

