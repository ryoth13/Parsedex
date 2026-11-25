/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#162a45", // 主背景色基于深色主题
        foreground: "#f4f7fb", // 前景文字颜色
      },
      backgroundImage: {
        'custom-gradient': "linear-gradient(135deg, #162a45 0%, #2f4f7c 45%, #5f7ec2 100%)",
      },
    },
  },
  plugins: [],
}
