import { useState } from 'react';

interface FoodImageProps {
  src: string | null;
  fallback: string;
  alt: string;
  className?: string;
}

export function FoodImage({ src, fallback, alt, className = '' }: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span className={`food-image-fallback ${className}`} aria-hidden={!alt}>{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`food-image ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
