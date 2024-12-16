import { FileType } from "@/types";
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

/**
 * Takes a file extension and returns the path to the icon for that type of
 * file. If the extension is not recognized, the type parameter is used to
 * determine the icon to use.
 *
 * @param {string | undefined} extension The file extension to determine the
 * icon for.
 * @param {FileType | string} type The type of file to determine the icon for.
 * If the extension is not recognized, the type parameter is used to determine
 * the icon to use.
 * @returns {string} The path to the icon for the given file type.
 */
const getFileIcon = (
  extension: string | undefined,
  type: FileType | string
) => {
  // Define a mapping of file extensions to icon paths
  const extensionToIconMap: { [key: string]: string } = {
    // Document icons
    pdf: "/assets/icons/file-pdf.svg",
    doc: "/assets/icons/file-doc.svg",
    docx: "/assets/icons/file-docx.svg",
    csv: "/assets/icons/file-csv.svg",
    txt: "/assets/icons/file-txt.svg",
    xls: "/assets/icons/file-document.svg",
    xlsx: "/assets/icons/file-document.svg",
    // Image icons
    svg: "/assets/icons/file-image.svg",
    // Video icons
    mkv: "/assets/icons/file-video.svg",
    mov: "/assets/icons/file-video.svg",
    avi: "/assets/icons/file-video.svg",
    wmv: "/assets/icons/file-video.svg",
    mp4: "/assets/icons/file-video.svg",
    flv: "/assets/icons/file-video.svg",
    webm: "/assets/icons/file-video.svg",
    m4v: "/assets/icons/file-video.svg",
    "3gp": "/assets/icons/file-video.svg",
    // Audio icons
    mp3: "/assets/icons/file-audio.svg",
    mpeg: "/assets/icons/file-audio.svg",
    wav: "/assets/icons/file-audio.svg",
    aac: "/assets/icons/file-audio.svg",
    flac: "/assets/icons/file-audio.svg",
    ogg: "/assets/icons/file-audio.svg",
    wma: "/assets/icons/file-audio.svg",
    m4a: "/assets/icons/file-audio.svg",
    aiff: "/assets/icons/file-audio.svg",
    alac: "/assets/icons/file-audio.svg"
  };

  // Check if the extension exists and return the corresponding icon path
  if (extension && extensionToIconMap[extension]) {
    return extensionToIconMap[extension];
  }

  // If no specific icon for the extension, use the type to determine the icon
  switch (type) {
    case "image":
      return "/assets/icons/file-image.svg";
    case "document":
      return "/assets/icons/file-document.svg";
    case "video":
      return "/assets/icons/file-video.svg";
    case "audio":
      return "/assets/icons/file-audio.svg";
    default:
      return "/assets/icons/file-other.svg";
  }
};

/**
 * Takes a File object and returns a URL that can be used to display the file
 * in the browser. The URL is created using the URL.createObjectURL() method.
 *
 * @param {File} file The File object to create a URL for.
 * @returns {string} A URL that can be used to display the file in the browser.
 */
const convertFileToUrl = (file: File) => URL.createObjectURL(file);

/**
 * Construct a URL that can be used to view a file stored in the Appwrite
 * storage bucket. The URL is constructed from the Appwrite endpoint, the
 * bucket ID and the file ID.
 *
 * @param {string} bucketFileId The ID of the file in the Appwrite storage
 * bucket.
 * @returns {string} A URL that can be used to view the file in the browser.
 */
const constructFileUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

/**
 * Returns an array of file types based on the type parameter.
 * The type parameter can be one of the following:
 * - documents: Returns an array with only the "document" type.
 * - images: Returns an array with only the "image" type.
 * - media: Returns an array with only the "video" and "audio" types.
 * - others: Returns an array with only the "other" type.
 * - (default): Returns an array with only the "document" type.
 *
 * @param {string} type The type parameter to determine the file types to return.
 * @returns {string[]} An array of file types.
 */
const getFileTypesParams = (type: string) => {
  switch (type) {
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "others":
      return ["other"];
    default:
      return ["document"];
  }
};


/**
 * Converts a given file size in bytes to a human-readable format.
 * The size is converted to the largest possible unit (Bytes, KB, MB, GB).
 * If the size is less than 1 KB, the size is displayed in Bytes.
 * If the size is less than 1 MB, the size is displayed in KB.
 * If the size is less than 1 GB, the size is displayed in MB.
 * If the size is 1 GB or more, the size is displayed in GB.
 *
 * @param {number} sizeInBytes The file size in bytes.
 * @param {number} [digits] The number of decimal places to round the size to.
 * @returns {string} The human-readable file size.
 */
const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes"; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB"; // 1 GB or more, show in GB
  }
};

/**
 * Formats an ISO date string into a human-readable format.
 * If the input string is null, undefined, or empty, the function returns "—".
 * The format is 12-hour time with am/pm, followed by the day, month, and year.
 * For example, "3:45pm, 15 Jul".
 * @param {string | null | undefined} isoString The ISO date string to format.
 * @returns {string} The formatted date string.
 */
const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  // Get hours and adjust for 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time and date parts
  const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  return `${time}, ${day} ${month}`;
};


/**
 * Construct a URL that can be used to download a file stored in the Appwrite
 * storage bucket.
 *
 * @param {string} bucketFileId The ID of the file in the Appwrite storage
 * bucket.
 * @returns {string} A URL that can be used to download the file.
 */
const constructDownloadUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

/**
 * Returns an array of summaries of files in the storage bucket, organized by file type.
 * Each summary contains the title of the file type, the total size of files of that type,
 * the latest modification date of files of that type, the icon representing the file type,
 * and the URL path for the file type.
 * @param {Object} totalSpace The object containing the total space used by each type of file.
 * @returns {Array<Object>} An array of summaries of files in the storage bucket.
 */
 const getUsageSummary = (totalSpace: any) => {
  return [
    {
      // Summary for document files
      title: "Documents",
      size: totalSpace.document.size, // Total size of document files
      latestDate: totalSpace.document.latestDate, // Latest modification date of document files
      icon: "/assets/icons/file-document-light.svg", // Icon representing document files
      url: "/documents", // URL path for document files
    },
    {
      // Summary for image files
      title: "Images",
      size: totalSpace.image.size, // Total size of image files
      latestDate: totalSpace.image.latestDate, // Latest modification date of image files
      icon: "/assets/icons/file-image-light.svg", // Icon representing image files
      url: "/images", // URL path for image files
    },
    {
      // Summary for media files (video and audio combined)
      title: "Media",
      size: totalSpace.video.size + totalSpace.audio.size, // Combined size of video and audio files
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate, // Latest modification date among video and audio files
      icon: "/assets/icons/file-video-light.svg", // Icon representing media files
      url: "/media", // URL path for media files
    },
    {
      // Summary for other files
      title: "Others",
      size: totalSpace.other.size, // Total size of other files
      latestDate: totalSpace.other.latestDate, // Latest modification date of other files
      icon: "/assets/icons/file-other-light.svg", // Icon representing other files
      url: "/others", // URL path for other files
    },
  ];
};

/**
 * Calculates the percentage of a given size in bytes relative to a total size of 2GB.
 * The result is rounded to two decimal places.
 *
 * @param {number} sizeInBytes The size in bytes to calculate the percentage for.
 * @returns {number} The percentage of the size relative to 2GB.
 */
const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024; // Total size of 2GB in bytes
  const percentage = (sizeInBytes / totalSizeInBytes) * 100; // Calculate percentage
  return Number(percentage.toFixed(2)); // Round to two decimal places and return
};


export {
  getFileType,
  parseStringify,
  getFileIcon,
  convertFileToUrl,
  constructFileUrl,
  getFileTypesParams,
  convertFileSize,
  formatDateTime,
  constructDownloadUrl,
  getUsageSummary,
  calculatePercentage
};