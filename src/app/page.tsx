"use client";
import SZE from "../assets/sze.png"

import { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';
import Menus from '@/components/menus';
import UserContext from '@/context/user.context';

export default function Home() {

  const menuLeft = useRef<Menu | null>(null);
  const router = useRouter();

  const { user } = useContext<any>(UserContext);
  const [checkUser, setuser] = useState<any | null>(user);

  useEffect(() => { setuser(user) }, [user])


  return (
    <main className="flex min-h-screen flex-col items-center justify-center lg:p-24 p-16  bg-white">
      {
        checkUser ?
          <Menus menuLeft={menuLeft}></Menus> : <></>
      }

      <div className="flex flex-col  gap-2">
        {/* <Image src={"/icon-only.png"} width={300} height={300} alt='icon'></Image> */}
        <div className="items-center">
          <button onClick={() => {
            const link = document.createElement('a');
            link.href = 'https://drive.google.com/file/d/1btLmzhTym17loZ-36_q4Ij_mYOtACOZq/view?usp=drive_link';
            link.download = 'sze-helper.apk';

            link.click();
          }} className='w-full h-full px-4 py-2 border-2 rounded-xl border-blue-800 border-red-800  bg-red-800 hover:border-blue-900 hover:border-red-900 border-red-900 hover:bg-blue-900 hover:bg-red-900 text-white'>
            <i className='pi pi-mobile'></i> Download APK
          </button>

        </div>
      </div>
    </main>
  )
}
