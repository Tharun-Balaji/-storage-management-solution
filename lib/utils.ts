import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deeply clones a value using JSON.stringify and JSON.parse.
 *
 * Note that this will only work on objects that can be serialized to JSON.
 * If you need to clone a value that contains functions, symbols, or other
 * values that cannot be serialized to JSON, you may need to use a different
 * approach.
 *
 * @example
 * const original = { a: 1, b: 2 };
 * const clone = parseStringify(original);
 * original !== clone; // true
 * original.a = 3;
 * clone.a; // 1
 */
const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));


/**
 * Takes a file name and returns an object with two properties: type and extension.
 * The type property can be one of the following:
 * - "document" if the file extension is one of the following: pdf, doc, docx, txt, xls, xlsx, csv, rtf, ods, ppt, odp, md, html, htm, epub, pages, fig, psd, ai, indd, xd, sketch, afdesign, afphoto
 * - "image" if the file extension is one of the following: jpg, jpeg, png, gif, bmp, svg, webp
 * - "video" if the file extension is one of the following: mp4, avi, mov, mkv, webm
 * - "audio" if the file extension is one of the following: mp3, wav, ogg, flac
 * - "other" if the file extension doesn't match any known types
 *
 * @param {string} fileName The file name to determine the type of
 * @returns {Object} An object with two properties: type and extension
 */
const getFileType = (fileName: string) => {
  // Extract the file extension from the fileName
  const extension = fileName.split(".").pop()?.toLowerCase();

  // If no extension is found, return the type as "other"
  if (!extension) return { type: "other", extension: "" };

  // Define a list of document file extensions
  const documentExtensions = [
    "pdf", "doc", "docx", "txt", "xls", "xlsx", "csv", "rtf", "ods",
    "ppt", "odp", "md", "html", "htm", "epub", "pages", "fig", "psd",
    "ai", "indd", "xd", "sketch", "afdesign", "afphoto"
  ];

  // Define a list of image file extensions
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];

  // Define a list of video file extensions
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];

  // Define a list of audio file extensions
  const audioExtensions = ["mp3", "wav", "ogg", "flac"];

  // Determine the type of file based on its extension
  if (documentExtensions.includes(extension))
    return { type: "document", extension };
  if (imageExtensions.includes(extension))
    return { type: "image", extension };
  if (videoExtensions.includes(extension))
    return { type: "video", extension };
  if (audioExtensions.includes(extension))
    return { type: "audio", extension };

  // Default to "other" type if the extension doesn't match any known types
  return { type: "other", extension };
};

export { getFileType, parseStringify };