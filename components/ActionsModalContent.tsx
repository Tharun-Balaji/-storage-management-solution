
import { Models } from 'node-appwrite';
import React from 'react'
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';

/**
 * Renders a thumbnail image along with the file name and creation date.
 *
 * @param {object} props - The properties object.
 * @param {Models.Document} props.file - The document file object containing details to display.
 *
 * @returns {JSX.Element} A div containing a Thumbnail component and file details.
 */
function ImageThumbnail({ file }: { file: Models.Document }) {

  return (
    <div className="file-details-thumbnail">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <FormattedDateTime date={file.$createdAt} className="caption" />
      </div>
    </div>
  );

}



/**
 * A reusable component for displaying a label-value pair in the file details dialog.
 *
 * @param {{ label: string, value: string }} props - The properties object.
 * @param {string} props.label - The label of the detail row.
 * @param {string} props.value - The value of the detail row.
 *
 * @returns {JSX.Element} A div containing a label and value of the detail row.
 */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <p className="file-details-label text-left">{label}</p>
      <p className="file-details-value text-left">{value}</p>
    </div>
  );
}
  



/**
 * Displays detailed information about a file, including its thumbnail, format, size, owner, and last edit date.
 *
 * @param {object} props - The properties object.
 * @param {Models.Document} props.file - The document file object containing details to display.
 *
 * @returns {JSX.Element} A fragment containing an ImageThumbnail and several DetailRow components displaying file information.
 */
function FileDetails({ file }: { file: Models.Document }) {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owners.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
}

export { FileDetails };