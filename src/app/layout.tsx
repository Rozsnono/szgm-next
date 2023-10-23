"use client";
import Navbar from '@/components/navbar';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from 'react-query';
import UserContext from '@/context/user.context';
import { useState } from 'react';
import Form from '@/components/form';
import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient();
  const router = useRouter();
  const pathName = usePathname();
  const [user, setUser] = useState<any | null>(
    typeof localStorage === "undefined" ? null
      : localStorage.getItem("user") === "undefined" ? null
        : (JSON.parse(localStorage.getItem("user") as string) === null ? null
          : JSON.parse(localStorage.getItem("user") as string) as any));

  return (
    <html lang="en">
      <title>Széchenyi István Egyetem Vizsga és Zárthelyi gyakorló oldal</title>

      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={{ user, setUser }}>
            <Navbar>
              <Form>
                {(pathName != "/") ? <></> : children}
              </Form>
            </Navbar>
          </UserContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
