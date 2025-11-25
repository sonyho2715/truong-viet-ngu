import { ReactNode } from 'react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string | ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  className = '',
}: AvatarProps) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const getFallbackText = () => {
    if (typeof fallback === 'string') {
      return fallback.slice(0, 2).toUpperCase();
    }
    if (alt) {
      const words = alt.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return alt.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div
      className={`
        relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full
        bg-brand-navy text-white font-bold
        ${sizes[size]}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Hide the image on error and show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : typeof fallback === 'string' || !fallback ? (
        <span>{getFallbackText()}</span>
      ) : (
        fallback
      )}
    </div>
  );
};

export { Avatar };
