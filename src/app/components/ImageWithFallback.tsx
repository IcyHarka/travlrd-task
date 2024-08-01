"use client"

import { FC, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends ImageProps {
  src: string;
  alt: string;
}

const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  src,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc("/no-image.png")}
    />
  );
};

export default ImageWithFallback;
