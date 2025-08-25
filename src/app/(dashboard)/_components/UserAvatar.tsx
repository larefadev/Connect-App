'use client';
import { useState } from 'react';
import Image from 'next/image';
import { usePerson } from '@/hooks/Person/usePerson';

interface UserAvatarProps {
  email: string;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ email, size = 32 }) => {
  const [imageError, setImageError] = useState(false);
  const { person } = usePerson();
  
  // Si hay una imagen de perfil y no hay error, mostrarla
  if (person?.profile_image && !imageError) {
    return (
      <div 
        className="rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image 
          src={person.profile_image}
          width={size}
          height={size}
          className="rounded-full object-cover"
          alt="Foto de perfil del usuario"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // Si no hay imagen de perfil o hay error, mostrar las iniciales
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
};
