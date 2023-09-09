"use client";
import Image from 'next/image'
import SZE from "../assets/sze.png"

import { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';
import Menus from '@/components/menus';

export default function Home() {

  const menuLeft = useRef<Menu | null>(null);
  const router = useRouter();

  const items = [
    {
      label: '1. félév',
      items: [
        {
          label: 'SZGM',
          icon: 'pi pi-desktop',
          command: () => router.push('/szgm')
        }
      ]
    }, {
      label: '2. félév',
      items: [
        {
          label: 'SZGH',
          icon: 'pi pi-sitemap',
          command: () => router.push('/szgh')
        },
        {
          label: 'SZGH-ZH',
          icon: 'pi pi-server',
          command: () => router.push('/szgh-zh')
        },
        {
          label: 'PMSZT',
          icon: 'pi pi-database',
          command: () => router.push('/pmszt')
        },
        {
          label: 'RDSZ',
          icon: 'pi pi-cog',
          command: () => router.push('/rdsz')
        }
      ]
    }, {
      label: 'Kötelező nem szakmai',
      items: [
        {
          label: 'FIZIKA TÖRI',
          icon: 'pi pi-globe',
          command: () => router.push('/fizika')
        }
      ]
    },
    {
      label: 'Átlag',
      items: [
        {
          label: 'Átlag számítás',
          icon: 'pi pi-chart-bar',
          command: () => router.push('/atlag')
        }
      ]
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24 p-16">
      <Menus menuLeft={menuLeft} />

      <div className="lg:flex flex-cols-2 ">
        <Image src={SZE} height={100} width={600} alt='' ></Image>
        <div className="items-center">
          <button onClick={(event: any) => menuLeft.current?.toggle(event)} className='w-full h-full px-4 py-2 border-2 rounded-xl border-blue-800 bg-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-align-left'></i> Menu</button>
        </div>
      </div>
    </main>
  )
}
