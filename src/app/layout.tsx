"use client";
import Navbar from '@/components/navbar';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from 'react-query';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <title>Széchenyi István Egyetem Vizsga és Zárthelyi gyakorló oldal</title>

      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <Navbar>

            {children}
          </Navbar>

        </QueryClientProvider>
      </body>
    </html>
  )
}
