/** @type {import("tailwindcss";).Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        LilitaOne: ["LilitaOne", "sans-serif"],
        lexend: ["lexend", "sans-serif"],
        BeVietnamPro: ["BeVietnamPro", "sans-serif"],
        vietnam: ["Be Vietnam Pro", "sans-serif"],
      },
      fontSize: {
        "20": "20px",
        "23": "23px",
        "40": "40px",
        "9": "9px",
      },
      colors: {
        pageBackground: "#353535",
        background: "#3D3D3D",
        primary: "#D74646",
        hr: "#515151",
        hover: "#515151",
        notification: "#F90",
        fill: "#888",
        chatBackground: "#1F1F1F",
        msgcolor: "#ACACAC",
        onlineStatus: "#01FF39",
        msgbackground: "#6A6A6A",
        Vu: "#52EAFF",
        cardHover: "#484848",
        history: "#3F3F3F",
        numberpage: "#A0A0A0",
        popup: "rgba(0, 0, 0, 0.2)",
      },
      linearGradient: {
        backgroundLinear:
          "linear-gradient(96deg, #3D3D3D 55.91%, rgba(56, 56, 56, 0.87) 85.5%))",
      },
      width: {
        moreIcon: "20px",
      },
      height: {
        moreIcon: "20px",
      },
      boxShadow: {
        custom: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },

      // borderWidth: {
      // }
    },
  },
  plugins: [],
};
// export default config;
