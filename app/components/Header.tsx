import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SettingsMenu from './SettingsMenu';

const Header = () => {
  const { data: session, status } = useSession();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgDataUrl = event.target?.result as string;
        setProfilePic(imgDataUrl);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4">
      <div className="flex items-center">
        {status === 'loading' ? (
          <p className="text-xl font-bold">Loading...</p>
        ) : session && session.user ? (
          <div className="relative group">
            <img
              src={profilePic || '/images/default-profile-pic.png'}
              alt="Profile"
              className="w-12 h-12 rounded-full cursor-pointer"
            />
            <span className="absolute left-0 px-2 py-1 mt-2 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100">
              {session.user.email}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <p className="text-xl font-bold">No user</p>
        )}
      </div>
      <SettingsMenu />
    </header>
  );
};

export default Header;
