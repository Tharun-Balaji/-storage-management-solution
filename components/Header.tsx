
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Search from './Search';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';


export default function Header() {
  return (
    <header className="header">
      {/* Search component for searching files */} <Search />
      <div className="header-wrapper">
        {/* File uploader component for uploading files */}
        <FileUploader />
        {/* Form for signing out of the app */}
        <form
          /* This special "use server" comment is for next.js
           * https://nextjs.org/docs/api-reference/pages/get-server-side-props */
          action={async () => {
            "use server";

            /* Sign out the user */
            await signOutUser();
          }}
        >
          {/* Button for signing out of the app */}
          <Button type="submit" className="sign-out-button">
            {/* Icon for the sign out button */}
            <Image
              src="/assets/icons/logout.svg"
              alt="Logo for signing out"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}
