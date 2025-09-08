import { useState } from 'react';

interface ProductImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    fallbackClassName?: string;
    fallbackIcon?: React.ReactNode;
}

export const ProductImage = ({ 
    src, 
    alt, 
    className = "", 
    fallbackClassName = "bg-gray-200",
    fallbackIcon = null 
}: ProductImageProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!src || imageError) {
        return (
            <div className={`${fallbackClassName} rounded-lg flex items-center justify-center ${className}`}>
                {fallbackIcon || (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <img 
                src={src} 
                alt={alt} 
                className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
            />
            {!imageLoaded && (
                <div className={`${fallbackClassName} rounded-lg flex items-center justify-center ${className} absolute inset-0`}>
                    <div className="animate-pulse">
                        {fallbackIcon || (
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
