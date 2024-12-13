"use server";

import { DeleteFileProps, GetFilesProps, RenameFileProps, UpdateFileUsersProps, UploadFileProps } from "@/types";
import { appwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "../appwrite";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "@/lib/actions/user.actions";



/**
 * Logs the given error and message to the console and re-throws the error
 * to be handled by the caller.
 * @param error The error to log and re-throw
 * @param message The message to log
 */
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

/**
 * Creates an array of queries that can be used to filter and sort files in Appwrite.
 * The queries are as follows:
 * 1. `Query.or` that matches files where the owner is the current user or the
 *    current user is listed in the `users` array.
 * 2. `Query.equal` that matches files where the `type` field is one of the given types.
 * 3. `Query.contains` that matches files where the `name` field contains the given search text.
 * 4. `Query.limit` that limits the number of files returned to the given limit.
 * 5. `Query.orderAsc` or `Query.orderDesc` that sorts the files by the given field in ascending or descending order.
 * @param currentUser The current user document
 * @param types The types of files to filter by
 * @param searchText The text to search for in the file names
 * @param sort The field to sort by and the order of the sort
 * @param limit The maximum number of files to return
 * @returns An array of queries that can be passed to `listDocuments` to filter and sort files
 */
const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    // Match files where the owner is the current user or the current user is listed in the users array
    Query.or([
      Query.equal("owners", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) {
    // Match files where the type is one of the given types
    queries.push(Query.equal("type", types));
  }

  if (searchText) {
    // Match files where the name contains the given search text
    queries.push(Query.contains("name", searchText));
  }

  if (limit) {
    // Limit the number of files returned to the given limit
    queries.push(Query.limit(limit));
  }

  if (sort) {
    // Sort the files by the given field in ascending or descending order
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};



/**
 * Uploads a file to Appwrite and creates a corresponding document in the
 * files collection.
 * @param file The file to upload
 * @param ownerId The ID of the user who owns the file
 * @param accountId The ID of the account that the file belongs to
 * @param path The path to revalidate after uploading the file
 */
async function uploadFile({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) {

  const { storage, databases } = await createAdminClient();
  console.log({ file, ownerId, accountId });

  try {
    // Create an InputFile from the given File object
    const inputFile = InputFile.fromBuffer(file, file.name);

    // Upload the file to Appwrite
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    // Create a document in the files collection with the given properties
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owners: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    // Create a new document in the files collection
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        // If the document creation fails, delete the file from storage
        // to avoid leaving an orphaned file in storage
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    // Revalidate the given path to ensure that the newly uploaded file
    // is visible to the user
    revalidatePath(path);
    return parseStringify(newFile);

  } catch (error) {
    handleError(error, "Failed to upload file");
  } 

};

/**
 * Retrieves a list of files from the Appwrite database based on the specified
 * filter and sorting criteria. The function queries the files collection to
 * find files that match the provided types, search text, and sort order. It
 * also limits the number of files returned to the specified limit.
 * 
 * @param {GetFilesProps} props - The props to filter and sort the files.
 * @param {FileType[]} props.types - The types of files to filter by.
 * @param {string} [props.searchText] - The search text to filter the files by.
 * @param {string} [props.sort] - The field and order to sort the files by.
 * @param {number} [props.limit] - The maximum number of files to return.
 * @returns {Promise<Object>} A promise that resolves to the list of files
 * matching the specified criteria, or an error if the retrieval fails.
 * @throws {Error} Throws an error if the current user is not found.
 */
const getFiles = async ({
  types = [], // The types of files to filter by
  searchText = "", // The search text to filter the files by
  sort = "$createdAt-desc", // The sort of the files
  limit, // The limit of the files
}: GetFilesProps) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    // Create an array of queries to filter and sort the files
    const queries = createQueries(currentUser, types, searchText, sort, limit);

    // Query the files collection to get the files
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    console.log({ files });
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

/**
 * Renames a file in the files collection with the given file ID
 * @param {{ fileId: string; name: string; extension: string; path: string; }} props
 * @param {string} props.fileId - The ID of the file to be renamed
 * @param {string} props.name - The new name of the file
 * @param {string} props.extension - The extension of the file (e.g. "txt", "pdf")
 * @param {string} props.path - The path to the file (e.g. "files/demo.txt")
 * @returns {Promise<Object | null>} The updated file document if the file was renamed successfully, null otherwise
 */
const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    );

    // Revalidate the path to the file so that the file can be accessed with the new name
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};


/**
 * Updates the users of a file in the files collection with the given file ID
 * @param {{ fileId: string; emails: string[]; path: string; }} props
 * @param {string} props.fileId - The ID of the file to be updated
 * @param {string[]} props.emails - The emails of the users to be added to the file
 * @param {string} props.path - The path to the file (e.g. "files/demo.txt")
 * @returns {Promise<Object | null>} The updated file document if the file was updated successfully, null otherwise
 */
const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    // Update the users of the file with the given emails
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      }
    );

    // Revalidate the path to the file so that the new users can access the file
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};


/**
 * Deletes a file from the files collection with the given file ID and bucket file ID
 * @param {{ fileId: string; bucketFileId: string; path: string; }} props
 * @param {string} props.fileId - The ID of the file to be deleted
 * @param {string} props.bucketFileId - The ID of the file in the storage bucket
 * @param {string} props.path - The path to the file (e.g. "files/demo.txt")
 * @returns {Promise<Object | null>} The deleted file document if the file was deleted successfully, null otherwise
 */
const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    // If the file was deleted successfully, delete the file from the storage bucket
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    // Revalidate the path to the file so that the file can no longer be accessed
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
export {
  uploadFile,
  getFiles,
  renameFile,
  updateFileUsers,
  deleteFile
};