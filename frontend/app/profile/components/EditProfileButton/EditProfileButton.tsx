import Link from "next/link";
import React from "react";

const EditProfileButton = () => {
  return (
    <Link href={"/setting"} type="button">
      <div className="flex items-end pb-4 pl-3">
        <button
          className="box-shadow-md dark:shadow-x-gray-700 h-9 w-28 rounded-lg text-center font-vietnam text-[15px] font-medium text-white  dark:shadow-md "
          style={{ backgroundColor: "#474646" }}
        >
          Edit Profile
        </button>
      </div>
    </Link>
  );
};

export default EditProfileButton;
