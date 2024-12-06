import Image from 'next/image';
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex min-h-screen">
        <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
          <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="logo"
              width={224}
              height={82}
              className="h-auto"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
