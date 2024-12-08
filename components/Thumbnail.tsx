import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'


interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}


/**
 * A Thumbnail component to render an image or icon based on the
 * file type and extension.
 *
 * @param {string} type - The type of the file. One of "image",
 * "video", "audio", "document", or "archive".
 * @param {string} extension - The file extension. Will be used to
 * determine the icon if the file type is not an image.
 * @param {string} [url] - The URL of the image to render. If not
 * provided, an icon will be used based on the file type and
 * extension.
 * @param {string} [imageClassName] - Any additional CSS classnames to
 * apply to the image element.
 * @param {string} [className] - Any additional CSS classnames to
 * apply to the outermost element.
 *
 * @returns {JSX.Element} A `figure` element with an `Image` component
 * inside. The `Image` will have a width and height of 100px and will
 * be centered using the `object-contain` CSS value.
 */

function Thumbnail({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: Props) {
  
   const isImage = type === "image" && extension !== "svg";


  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
      />
    </figure>
  );
}

export default Thumbnail;