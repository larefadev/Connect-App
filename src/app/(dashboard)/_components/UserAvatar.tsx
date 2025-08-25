'use client';
import { useState } from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  email: string;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ email, size = 32 }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !email) {
    return (
      <div 
        className="bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.4 }}>
          {email ? email.charAt(0).toUpperCase() : 'U'}
        </span>
      </div>
    );
  }

  return (
    <Image 
      src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${encodeURIComponent(email)}`}
      width={size}
      height={size}
      className="rounded-full object-cover"
      alt="Avatar del usuario"
      onError={() => setImageError(true)}
    />
  );
};
