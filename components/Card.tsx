import { Models } from 'node-appwrite';
import React from 'react'
import Link from "next/link";
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import ActionDropdown from './ActionDropdown';
import { convertFileSize } from '@/lib/utils';

/**
 * Renders a card component for a file, displaying a thumbnail preview, file details,
 * and actions related to the file. The card links to the file URL and opens it in a new tab.
 *
 * @param {object} props - The properties object.
 * @param {Models.Document} props.file - The document file object containing details to display.
 *
 * @returns {JSX.Element} A link element containing a file thumbnail, details, and action dropdown.
 */
function Card({ file }: { file: Models.Document }) {
  return (
    // Link component that navigates to the file URL in a new tab
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex justify-between">
        {/* Thumbnail component to display a preview of the file */}
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          {/* Dropdown with actions related to the file */}
          <ActionDropdown file={file} />
          {/* Displays the file size */}
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        {/* Displays the file name */}
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        {/* Displays the formatted creation date of the file */}
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        {/* Displays the owner's name */}
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owners.fullName}
        </p>
      </div>
    </Link>
  );
}

export default Card