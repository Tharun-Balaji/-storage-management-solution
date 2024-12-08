"use server";

import { UploadFileProps } from "@/types";
import { appwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "../appwrite";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";


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

export { uploadFile };