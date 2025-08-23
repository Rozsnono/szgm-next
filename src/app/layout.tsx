"use client";
import Navbar from '@/components/navbar';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import UserContext, { Coder } from '@/context/user.context';
import { useEffect, useState } from 'react';
import Form from '@/components/form';
import { usePathname, useRouter } from 'next/navigation';
import Message from '@/components/message';
import dynamic from 'next/dynamic';
import "../css/light.css";
import Image from 'next/image'


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  const queryClient = new QueryClient();
  const router = useRouter();
  const pathName = usePathname();
  const [user, setUser] = useState<any | null | undefined>(undefined);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //     if (mediaQuery.matches) {
  //       const darkMode = "../css/dark.css";
  //       import("../css/dark.css");
  //     } else {
  //       import("../css/light.css");
  //     }
  //   }
  // }, [])

  return (
    <html lang="en">
      <title>Vizsga és Zárthelyi gyakorló oldal</title>

      <body className={inter.className + "w-screen h-screen flex items-center justify-center"}>
        <div className='flex flex-col items-center justify-center gap-2'>
          <Image src={"/icon-only.png"} width={300} height={300} alt='icon'></Image>

          <h1 className='text-3xl text-zinc-900'>Az oldal bezárásra került!</h1>
          <p className='text-zinc-600'>Kérjük, vegye fel a kapcsolatot a fejlesztővel.</p>
        </div>
        {/* <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={{ user, setUser }}>
            <Navbar>
              <div className=' bg-white'>
                {children}

              </div>
            </Navbar>
          </UserContext.Provider>
        </QueryClientProvider> */}
      </body>
    </html>
  )
}
