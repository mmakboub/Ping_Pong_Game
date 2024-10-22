"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/app/services/api-client";
import axios from "axios";
import Image from "next/image";
const nonimage = "/defaultprofile.jpg";

interface ProfileImageChangerProps {
  defaultImage: string;
  imageUrl: (value: string) => void;
}

const ProfileImageChanger: React.FC<ProfileImageChangerProps> = ({
  defaultImage,
  imageUrl,
}) => {
  const [profileImage, setprofileImage] = useState(defaultImage);
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      console.error('File is undefined');
    }
    formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUD_PRESET}`);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData
      );
      setprofileImage(res.data.secure_url);
      imageUrl(res.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex h-[45%] w-full ">
      <div className="flex h-full w-[25%] items-center">
        <Image
          src={profileImage}
          alt="Profile"
          height={400}
          width={400}
          className=" ml-8  h-[50%]  w-[50%] rounded-lg "
        />
      </div>
      <div className="flex h-full w-[20%] flex-col justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="imageInput"
        />
        <label
          htmlFor="imageInput"
          className="cursor-pointer rounded-md bg-gradient-to-b mb-6 from-neutral-700 to-neutral-700 px-1 py-2 text-center font-vietnam text-white hover:bg-hover hover:text-primary hover:shadow-md hover:shadow-[#242424]"
        >
          Upload avatar
        </label>

      </div>
    </div>
  );
};

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: "first name must be not empty" })
    .max(15, { message: "first name must be less than 15 characters" }),
  lastName: z
    .string()
    .min(1, { message: "last name must be not empty" })
    .max(15, { message: "last name must be less than 15 characters" }),
  userName: z
    .string()
    .min(4, { message: "user name to short" })
    .max(10, { message: "user name to long" }),
});

type FormData = z.infer<typeof schema>;

function ProfileInfo() {
  const [usernameError, setUsernameError] = useState<string>("");
  const [urlImage, setImageUrl] = useState("");
  const imageUrl = (value: string) => {
    setImageUrl(value);
  };
  const { userData, setUserData, UserLoading, setUserLoading } =
    useGlobalUserContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: userData.firstname,
      lastName: userData.lastname,
      userName: userData.username,
    },
  });

  const handleReset = () => {
    reset({
      firstName: userData.firstname,
      lastName: userData.lastname,
      userName: userData.username,

    });

  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleReset();
  };
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue("firstName", e.target.value);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue("lastName", e.target.value);
  };

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue("userName", e.target.value);
  };
  const handleFormSubmissionResult = async (
    data: FormData,
    imageUrlToUpdate: string
  ) => {
    const response = await apiClient.post("/Setting/update", {
      ...data,
    });
    if (response.data.message === true) {
      console.log("Success: Server response indicates successful update.");
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
      });
      setUsernameError("");
      setUserData({
        ...userData,
        pictureUrl: imageUrlToUpdate,
        username: data.userName,
        lastname: data.lastName,
        firstname: data.firstName,
      });
    } else {
      setUsernameError(
        "Username already exists. Please choose a different one."
      );
    }
  };


  const handleSubmitForm = async (data: FormData) => {

    try {
      if (urlImage !== "") {
        const res = await apiClient.post("/Setting/upload", {
          imageUrl: urlImage,
        });
      }
      const imageUrlToUpdate =
        urlImage !== "" ? urlImage : userData.pictureUrl;
      console.log(imageUrlToUpdate, 'image url value')
      handleFormSubmissionResult(data, imageUrlToUpdate);
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };
  return (
    <div className="flex h-full w-full  flex-col gap-5  rounded-[20px] bg-[#3D3D3D]">
      <div className=" h-[17%] w-full rounded-xl">
        <div className=" px-4 py-4 pl-10 font-vietnam  text-2xl  lg:text-3xl font-bold text-white">
          Profile Informations
        </div>
        <hr className="mx-auto my-2 h-px w-[95%] border-0 bg-[#515151] "></hr>
      </div>
      <div className="flex h-full flex-col gap-5">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex h-full w-full flex-col gap-5 justify-between"
        >
          <ProfileImageChanger
            defaultImage={userData.pictureUrl}
            imageUrl={imageUrl}
          />
          <div className="flex h-auto md:flex-row flex-col">
            <div className=" w-full px-5">
              <label
                htmlFor="grid-first-name"
                className="text-ml pl-3 font-bold text-white "
              >
                First Name
              </label>
              <input
                id="grid-first-name"
                {...register("firstName")}
                type="text"
                onChange={handleFirstNameChange}
                className=" mt-5 w-full rounded-[12px] border border-[#9E9E9E] bg-[#4E4E4E] px-4 py-3 text-white focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="w-full px-5">
              <label
                htmlFor="grid-last-name"
                className="text-ml pl-3 font-bold  text-white"
              >
                Last Name
              </label>
              <input
                {...register("lastName")}
                type="text"
                id="grid-last-name"
                onChange={handleLastNameChange}
                className="mt-5 w-full rounded-[12px] border border-[#9E9E9E] bg-[#4E4E4E] px-4 py-3 text-white focus:outline-none "
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}
            </div>
            <div className="w-full px-5">
              <label
                htmlFor="grid-user-name"
                className="text-ml pl-3 font-bold  text-white"
              >
                UserName
              </label>
              <input
                id="grid-last-name"
                {...register("userName")}
                type="text"
                onChange={handleUserNameChange}
                className=" mt-5 w-full rounded-[12px] border border-[#9E9E9E] bg-[#4E4E4E] px-4 py-3 text-white focus:outline-none"
              />
              {(errors.userName?.message || usernameError) && (
                <p className="text-red-500">
                  {errors.userName?.message || usernameError}
                </p>
              )}
            </div>
          </div>

          <div className="flex h-[23%] flex-row  items-start justify-center gap-10">
            <button
              type="submit"
              className="rounded-[20px] bg-gradient-to-b from-neutral-700 to-neutral-700 px-8 py-4 text-center text-white hover:bg-hover hover:text-primary hover:shadow-md hover:shadow-[#242424] "
            >
              Save
            </button>
            <button onClick={handleCancel} className=" rounded-[20px] bg-gradient-to-b from-neutral-700 to-neutral-700 px-8 py-4 text-center text-white hover:bg-hover hover:text-primary hover:shadow-md hover:shadow-[#242424]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProfileInfo;
