
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Search from './Search';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';


/**
 * The Header component renders a header with a search component, a file uploader
 * and a sign out button. The search component is used for searching files, the file
 * uploader is used for uploading files and the sign out button is used for signing out
 * of the app.
 *
 * @param {{ userId: string; accountId: string; }} props
 * @returns {JSX.Element}
 */
export default function Header({ userId, accountId }: { userId: string; accountId: string }) {
  return (
    <header className="header">
      {/* Search component for searching files */} <Search />
      <div className="header-wrapper">
        {/* File uploader component for uploading files */}
        <FileUploader ownerId={userId} accountId={accountId} />
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
