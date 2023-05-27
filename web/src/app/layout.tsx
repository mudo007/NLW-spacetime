import './globals.css'
import { ReactNode } from 'react'
// nextJS helps us easily import fonts from google
// needs also some configuration on the tailwindcss.config.js file
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'

import { Hero } from '@/components/Hero'
import { Profile } from '@/components/Profile'
import { SignIn } from '@/components/SignIn'
import { Copyright } from '@/components/Copyright'
import { cookies } from 'next/headers'

// we can pass a css variable name, so that tailwind css knows about it
// roboto is  aflex font, so it changes its weight dynamically
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
// baijamjuree is not flex, so we need to specify a weigth array. We just want it bold, so 1 is enough
const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NWL SpaceTime',
  description:
    'Uma capsula do tempo cosntruída com Next.js, TailwindCSS e Typescript. ',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')
  return (
    <html lang="en">
      {/* all defaults go into the body style */}
      <body
        className={`${roboto.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <main className="grid min-h-screen grid-cols-2">
          {/* Left */}
          <div className="relative flex flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover px-28 py-16">
            {/* this empty div creates the blur on the left collumn background */}
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />
            {/* Stripes */}
            <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />
            {isAuthenticated ? <Profile /> : <SignIn />}
            <Hero />
            <Copyright />
          </div>
          {/* Right */}
          <div className="flex flex-col bg-[url(../assets/bg-stars.svg)] bg-cover p-16 ">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
