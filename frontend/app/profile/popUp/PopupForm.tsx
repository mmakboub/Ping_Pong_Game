import React, { useState, ChangeEvent } from "react";
import { useGlobalUserContext } from "@/app/context/UserDataContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/app/services/api-client";
import { MdOutlineCloudUpload } from "react-icons/md";

import UploadImage from "./comp/uploadImage";

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: "first name must be not empty" })
    .max(15, { message: "first name must be less than 10 characters" }),
  lastName: z
    .string()
    .min(1, { message: "last name must be not empty" })
    .max(15, { message: "last name must be less than 10 characters" }),
  userName: z
    .string()
    .min(4, { message: "user name to short" })
    .max(10, { message: "user name to long" }),
});

type FormData = z.infer<typeof schema>;

function PopupForm() {
  const [isOpen, setIsOpen] = useState(true);
  const [urlImage, setImageUrl] = useState("");
  const [usernameError, setUsernameError] = useState<string>("");
  const { userData, setUserData, UserLoading, } =
    useGlobalUserContext();


  const imageUrl = (value: string) => {
    setImageUrl(value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset }
    = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        firstName: userData.firstname,
        lastName: userData.lastname,
        userName: userData.username,
      },
    });



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
        isfirsttime: false,
        lastname: data.lastName,
        firstname: data.firstName,
      });
      setIsOpen(false);
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
      handleFormSubmissionResult(data, imageUrlToUpdate);
    }
    catch (error) {
      console.error("Error sending form data:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-40">
          <div className=" h-auto w-auto rounded-2xl bg-[#3D3D3D] py-10 px-6 shadow-md">
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="flex h-auto w-auto flex-col gap-4 items-center justify-center"
            >
              <UploadImage
                defaultImage={userData.pictureUrl}
                imageUrl={imageUrl}
              />
              <div className="flex h-[70%] w-[70%] flex-col items-center justify-center gap-2">
                <div className="flex flex-col items-center justify-center px-5">
                  <label
                    htmlFor="grid-first-name"
                    className="flex-start text-ml ml-4 flex w-full text-white"
                  >
                    Enter your First Name
                  </label>
                  <input
                    id="grid-first-name"
                    {...register("firstName")}
                    type="text"
                    onChange={handleFirstNameChange}
                    className="mt-1 w-full rounded-[12px] bg-[#4E4E4E] px-4 py-3 text-white focus:border-white focus:text-white focus:outline-none"
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="mt-3 flex flex-col  items-center justify-center px-5">
                  <label
                    htmlFor="grid-last-name"
                    className="text-ml ml-4 w-full text-white"
                  >
                    Enter your Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    type="text"
                    id="grid-last-name"
                    onChange={handleLastNameChange}
                    className="mt-1 w-full rounded-[12px] bg-[#4E4E4E] px-4 py-3 text-white focus:border-white focus:text-white focus:outline-none"
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
                <div className="mt-3 flex  flex-col items-center justify-center px-5">
                  <label
                    htmlFor="grid-user-name"
                    className="text-ml ml-4 w-full text-white"
                  >
                    Enter your Username
                  </label>
                  <input
                    id="grid-last-name"
                    {...register("userName")}
                    type="text"
                    onChange={handleUserNameChange}
                    className="mt-1 w-full rounded-[12px] bg-[#4E4E4E] px-4 py-3 text-white focus:border-white focus:text-white focus:outline-none"
                  />
                  {(errors.userName?.message || usernameError) && (
                    <p className="text-red-500">
                      {errors.userName?.message || usernameError}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-1 rounded-lg bg-[#353535]  text-center font-bold text-white hover:text-primary  hover:shadow-md hover:shadow-[#242424]"
              >
                Save
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupForm;
