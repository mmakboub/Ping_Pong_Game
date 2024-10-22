import React, { useState, ChangeEvent, useEffect } from 'react';
import apiClient from '@/app/services/api-client';
import axios from 'axios'; import { MdOutlineCloudUpload } from "react-icons/md";
import { useGlobalUserContext } from '@/app/context/UserDataContext';
import Image from 'next/image';
interface ProfileImageChangerProps {
  defaultImage: string;
  imageUrl: (value: string) => void;
}
{/* ProfileImageChanger component */ }
const UploadImage: React.FC<ProfileImageChangerProps> = ({ defaultImage, imageUrl, }) => {
  const [profileImage, setprofileImage] = useState("");
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const formData = new FormData()
    if (file) {
      formData.append('file', file);
    }
    else {
      console.error('File is undefined');
    }
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUD_PRESET}`);
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, formData)
      setprofileImage(res.data.secure_url);
      imageUrl(res.data.secure_url);
    }
    catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center mb-4">
      <div className="border border-white rounded-xl w-[100px] h-[100px]">
        <Image
          src={profileImage || defaultImage}
          alt="Profile"
          className=" rounded-xl w-full h-full"
          width={100}
          height={100}
        />
      </div>
      <div className='flex h-full flex-col justify-center'>
        <div className='flex flex-start'>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden "
            id="imageInput"
          />
          <label htmlFor="imageInput" className="cursor-pointer  hover:text-primary font-vietnam font-bold bg-[#2B2B2B] text-center  hover:shadow-md hover:shadow-[#242424] text-white px-5 py-2 rounded-md flex items-center">
            <MdOutlineCloudUpload size={20} className="mr-2" />
            Upload avatar
          </label>
        </div>
      </div>
    </div>
  );
};
export default UploadImage