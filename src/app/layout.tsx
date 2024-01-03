"use client";
import Navbar from '@/components/navbar';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import UserContext, { Coder } from '@/context/user.context';
import { useState } from 'react';
import Form from '@/components/form';
import { usePathname, useRouter } from 'next/navigation';
import Message from '@/components/message';

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





  return (
    <html lang="en">
      <title>Vizsga és Zárthelyi gyakorló oldal</title>

      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={{ user, setUser }}>
            <Navbar>
              <Form>
                {children}
              </Form>
            </Navbar>
          </UserContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
