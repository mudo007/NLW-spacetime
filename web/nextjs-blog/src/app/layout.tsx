import "./globals.css";
// nextJS helps us easily import fonts from google
// needs also some configuration on the tailwindcss.config.js file
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from "next/font/google";

// we can pass a css variable name, so that tailwind css knows about it
// roboto is  aflex font, so it changes its weight dynamically
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
// baijamjuree is not flex, so we need to specify a weigth array. We just want it bold, so 1 is enough
const baiJamjuree = BaiJamjuree({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bai-jamjuree",
});

export const metadata = {
  title: "NWL SpaceTime",
  description:
    "Uma capsula do tempo cosntruída com Next.js, TailwindCSS e Typescript. ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* all defaults go into the body style*/}
      <body
        className={`${roboto.variable} bg-gray-900 font-sans text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
