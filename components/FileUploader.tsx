"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";


interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

/**
 * The FileUploader component is a react-dropzone wrapper that allows users to
 * upload files to Appwrite. It displays a list of files being uploaded and
 * provides a remove button for each file. The component accepts an ownerId and
 * accountId as required props, which are used to create a new document in the
 * files collection. The component also accepts a className prop, which is
 * applied to the container element.
 *
 * @param {Props} props The component props.
 * @return {ReactElement} The FileUploader component.
 */
function FileUploader({ ownerId, accountId, className }: Props) {
  // Get the current path from the navigation
  const path = usePathname();

  // State to store files
  const [files, setFiles] = useState<File[]>([]);

  // Callback function to handle file drops
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Set the accepted files to the state
    setFiles(acceptedFiles);

    // Map through accepted files to create upload promises
    const uploadPromises = acceptedFiles.map(async (file) => {
      // Check if the file exceeds the maximum allowed size
      if (file.size > MAX_FILE_SIZE) {
        // Remove the file from the state if it is too large
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        // Show a toast notification for the file size error
        return toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>
          ),
          className: "error-toast",
        });
      }

      // Upload the file and remove it from the state upon successful upload
      return uploadFile({ file, ownerId, accountId, path }).then(
        (uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          }
        },
      );
    });

    // Wait for all upload promises to complete
    await Promise.all(uploadPromises);

  }, [ownerId, accountId, path]);

  // Get root and input props from useDropzone hook
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Function to handle file removal
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // Render the file uploader component
  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button",className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FileUploader;
