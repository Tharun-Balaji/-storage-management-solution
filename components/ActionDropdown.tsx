"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";

/**
 * ActionDropdown component provides a dropdown menu for various file actions
 * such as rename, share, delete, and download. It also manages the state for 
 * modal dialogs corresponding to these actions and handles their execution.
 *
 * @param {{ file: Models.Document }} - The file object for which actions can be performed.
 *
 * @returns {JSX.Element} A dropdown menu with action items and modal dialogs.
 */
function ActionDropdown({ file }: { file: Models.Document }) {


  // Indicates whether the modal is open or not
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Indicates whether the dropdown menu is open or not
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // The type of action to take when the form is submitted
  const [action, setAction] = useState<ActionType | null>(null);
  // The new name of the file
  const [name, setName] = useState(file.name);
  // Indicates whether the form is being submitted
  const [isLoading, setIsLoading] = useState(false);
  // The new email addresses to add to the file
  const [emails, setEmails] = useState<string[]>([]);

  // The current path of the user
  const path = usePathname();

  /**
   * Closes all modals and resets their states
   */
  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    //   setEmails([]);
  };

  /**
   * Handles the selected action
   *
   * @remarks
   *
   * This function is called when an action is selected from the dropdown menu.
   * It will set the loading state to true, execute the selected action, and
   * then close all modals if the action was successful. Finally, it will set
   * the loading state to false.
   *
   * @returns {Promise<void>}
   */
  const handleAction = async () => {
    // Return early if no action is selected
    if (!action) return;

    // Set loading state to true
    setIsLoading(true);
    let success = false;

    // Define available actions
    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>  deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path })
    };

    // Execute the selected action
    success = await actions[action.value as keyof typeof actions]();

    // Close all modals if the action was successful
    if (success) closeAllModals();

    // Set loading state to false
    setIsLoading(false);
  };

  /**
   * Handles the removal of a user from the list of users to share the file with
   *
   * @param {string} email - The email of the user to be removed
   *
   * @returns {Promise<void>}
   */
  const handleRemoveUser = async (email: string) => {
    // Filter out the user to be removed from the list of emails
    const updatedEmails = emails.filter((e) => e !== email);

    // Update the file with the new list of users
    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    // If the update was successful, update the state and close all modals
    if (success) {
      setEmails(updatedEmails);
    }
          closeAllModals();
  };

  /**
   * Renders the content of the dialog based on the selected action.
   *
   * @remarks
   *
   * If the action is a rename, a text input field is rendered with the current name of the file.
   * If the action is a details action, the FileDetails component is rendered.
   * If the action is a share action, the ShareInput component is rendered.
   * If the action is a delete action, a confirmation message is displayed.
   *
   * @returns {JSX.Element | null} The content of the dialog or null if no action is selected.
   */
  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        {/* 
          The dialog header is a flex container which displays the action label 
          and a text input field for renaming the file. If the action is not a rename, 
          the text input is not rendered. If the action is a rename, the text input is 
          filled with the current name of the file and the user can edit it. When the 
          user changes the text input, the name state is updated with the new value. 
        */}
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // The input field is only rendered if the action is a rename
            />
          )}
          {/* 
            If the action is a details action, the FileDetails component is rendered. 
            It displays details about the file such as its name, size, and last modification date. 
          */}
          {value === "details" && <FileDetails file={file} />}
          {/* 
            If the action is a share action, the ShareInput component is rendered. It displays 
            a list of users that the file is shared with and allows the user to enter a new email
            address to add a new user to the list. The user can also remove a user from the list. 
          */}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {/* 
            If the action is a delete action, a confirmation message is displayed. The user is asked 
            if they are sure they want to delete the file. If the user clicks the delete button, the file 
            is deleted. If the user clicks the cancel button, the modal is closed. 
          */}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {/* 
          The dialog footer is a flex container which displays two buttons: cancel and submit. If the action is a rename, 
          delete or share action, the dialog footer is rendered. If the action is a details action, the dialog footer is not rendered. 
          When the user clicks the cancel button, the modal is closed. When the user clicks the submit button, the action is performed. If the action is a rename, 
          the file is renamed. If the action is a delete, the file is deleted. If the action is a share, the file is shared with the users in the list. If the action is a rename or delete, an 
          animated loader icon is displayed next to the submit button. 
        */}
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {/* Dropdown menu to show available actions for the file */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        {/* Trigger button with three dots icon */}
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="three dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>

        {/* Dropdown menu content */}
        <DropdownMenuContent>
          {/* Label displaying the file name */}
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>

          {/* Separator between label and actions */}
          <DropdownMenuSeparator />

          {/* Iterate over available actions to render each menu item */}
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                // Open modal for specific actions
                if (["rename", "share", "delete", "details"].includes(actionItem.value)) {
                  setIsModalOpen(true);
                }
              }}
            >
              {/* If action is 'download', render a download link */}
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                // Otherwise, render a regular div for the action
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render the dialog content based on the selected action */}
      {renderDialogContent()}
    </Dialog>
  );
}

export default ActionDropdown;
