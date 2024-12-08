/* eslint-disable no-unused-vars */

import { Models } from "node-appwrite";
import { type SegmentParams } from "next/navigation";
import React from "react";

/**
 * FileType represents the type of a file.
 * @enum {string}
 * @property {string} document - Document type.
 * @property {string} image - Image type.
 * @property {string} video - Video type.
 * @property {string} audio - Audio type.
 * @property {string} other - Other type.
 */
declare type FileType = "document" | "image" | "video" | "audio" | "other";

/**
 * ActionType represents an action that can be performed on a file.
 * @interface
 * @property {string} label - The label of the action.
 * @property {string} icon - The icon of the action.
 * @property {string} value - The value of the action.
 */
declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

/**
 * SearchParamProps represents the props of the SearchParams component.
 * @interface
 * @property {Promise<SegmentParams>} [params] - The search params.
 * @property {Promise<{ [key: string]: string | string[] | undefined }>} [searchParams] - The search params as an object.
 */
declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * UploadFileProps represents the props of the UploadFile component.
 * @interface
 * @property {File} file - The file to be uploaded.
 * @property {string} ownerId - The id of the owner of the file.
 * @property {string} accountId - The id of the account.
 * @property {string} path - The path of the file.
 */
declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
/**
 * GetFilesProps represents the props of the GetFiles component.
 * @interface
 * @property {FileType[]} types - The types of the files to be retrieved.
 * @property {string} [searchText] - The search text to filter the files.
 * @property {string} [sort] - The sort of the files.
 * @property {number} [limit] - The limit of the files.
 */
declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
/**
 * RenameFileProps represents the props of the RenameFile component.
 * @interface
 * @property {string} fileId - The id of the file to be renamed.
 * @property {string} name - The new name of the file.
 * @property {string} extension - The extension of the file.
 * @property {string} path - The path of the file.
 */
declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
/**
 * UpdateFileUsersProps represents the props of the UpdateFileUsers component.
 * @interface
 * @property {string} fileId - The id of the file to be updated.
 * @property {string[]} emails - The emails of the users to be added to the file.
 * @property {string} path - The path of the file.
 */
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
/**
 * DeleteFileProps represents the props of the DeleteFile component.
 * @interface
 * @property {string} fileId - The id of the file to be deleted.
 * @property {string} bucketFileId - The id of the file in the bucket.
 * @property {string} path - The path of the file.
 */
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

/**
 * FileUploaderProps represents the props of the FileUploader component.
 * @interface
 * @property {string} ownerId - The id of the owner of the file.
 * @property {string} accountId - The id of the account.
 * @property {string} [className] - The class name of the component.
 */
declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

/**
 * MobileNavigationProps represents the props of the MobileNavigation component.
 * @interface
 * @property {string} ownerId - The id of the owner of the file.
 * @property {string} accountId - The id of the account.
 * @property {string} fullName - The full name of the user.
 * @property {string} avatar - The avatar of the user.
 * @property {string} email - The email of the user.
 */
declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
/**
 * SidebarProps represents the props of the Sidebar component.
 * @interface
 * @property {string} fullName - The full name of the user.
 * @property {string} avatar - The avatar of the user.
 * @property {string} email - The email of the user.
 */
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

/**
 * ThumbnailProps represents the props of the Thumbnail component.
 * @interface
 * @property {string} type - The type of the file.
 * @property {string} extension - The extension of the file.
 * @property {string} url - The url of the file.
 * @property {string} [className] - The class name of the component.
 * @property {string} [imageClassName] - The class name of the image component.
 */
declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

/**
 * ShareInputProps represents the props of the ShareInput component.
 * @interface
 * @property {Models.Document} file - The file to be shared.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onInputChange - The callback to handle the input change.
 * @property {(email: string) => void} onRemove - The callback to handle the remove of an email.
 */
declare interface ShareInputProps {
  file: Models.Document;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}
