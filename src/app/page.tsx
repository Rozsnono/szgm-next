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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Menus menuLeft={menuLeft} />

      <div className="flex flex-cols-2">
        <Image src={SZE} height={100} width={600} alt='' ></Image>
        <div className="items-center">
          <Button label="Menu" icon="pi pi-align-left" className="w-full h-full" onClick={(event: any) => menuLeft.current?.toggle(event)} />
        </div>
      </div>
    </main>
  )
}
