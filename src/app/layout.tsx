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
import "../css/dark.css";

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

      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={{ user, setUser }}>
            <Navbar>
              <Form>
                <div className=' bg-[#1e1e1e]'>
                  {children}

                </div>
              </Form>
            </Navbar>
          </UserContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
