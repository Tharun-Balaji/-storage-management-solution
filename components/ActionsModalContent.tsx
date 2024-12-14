
import { Models } from 'node-appwrite';
import React from 'react'
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * The props for the ActionsModalContent component.
 *
 * @property {Models.Document} file - The document file object containing details to display.
 * @property {React.Dispatch<React.SetStateAction<string[]>>} onInputChange - The callback to handle the input change.
 * @property {(email: string) => void} onRemove - The callback to handle the remove of an email.
 */
interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}


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
    /* Container for the file thumbnail and details */
    <div className="file-details-thumbnail">
      {/* Thumbnail component to display file preview */}
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      {/* Container for file name and creation date */}
      <div className="flex flex-col">
        {/* Display file name */}
        <p className="subtitle-2 mb-1">{file.name}</p>
        {/* Display file creation date */}
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
      {/*
        The label of the detail row, displayed to the left of the value.
        This is the text that describes the value, for example "Format:".
      */}
      <p className="file-details-label text-left">{label}</p>
      {/*
        The value of the detail row, displayed to the right of the label.
        This is the actual value of the detail row, for example "PDF".
      */}
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
      {/*
        ImageThumbnail component renders a thumbnail image along with the file name and creation date.
      */}
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        {/*
          DetailRow component renders a label-value pair in the file details dialog.
          The label is the name of the detail row and the value is the value of the detail row.
        */}
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owners.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

/**
 * The ShareInput component renders a form field to enter an email address and a list
 * of users that the file is shared with. The users list is populated with the email
 * addresses from the file.users array. Each list item contains a remove button which
 * calls the onRemove function with the email address as an argument.
 *
 * @param {Props} props
 * @param {Models.Document} props.file - The document file object containing details to display.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onInputChange - The callback to handle the input change.
 * @param {(email: string) => void} props.onRemove - The callback to handle the remove of an email.
 * @returns {JSX.Element} A div containing a form field to enter an email address and a list of users that the file is shared with.
 */
function ShareInput({ file, onInputChange, onRemove }: Props) {

  return (
    <>
      <ImageThumbnail file={file} />

      {/* 
          The share wrapper div contains the form field to enter an email address
         and a list of users that the file is shared with. The users list is
         populated with the email addresses from the file.users array. Each
         list item contains a remove button which calls the onRemove function
         with the email address as an argument. 
      */}
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>

        {/*
             The input field where the user can enter an email address. The
             onChange event is handled by the onInputChange function which
             is passed as a prop. The function trims the input value and splits
             it on commas to create an array of email addresses. 
        */}
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />

        {/* The list of users that the file is shared with. The list is populated
             with the email addresses from the file.users array. Each list item
             contains a remove button which calls the onRemove function with
             the email address as an argument. 
             */}
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

}

export {
  FileDetails,
  ShareInput
};