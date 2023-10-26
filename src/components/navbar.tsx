
import { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import Menus from './menus';
import { Register } from './form';
import UserContext, { logout } from '@/context/user.context';
import { useRouter } from 'next/navigation';

import MobileMenu from "./mobile.menu"
import { useQuery } from 'react-query';

export default function Navbar({
    children,
}: {
    children: React.ReactNode
}) {

    const menuLeft = useRef<Menu | null>(null);

    const { user, setUser } = useContext<any>(UserContext);

    const [checkUser, setCheckUser] = useState<any | null>(user);

    useEffect(() => { setCheckUser(user); }, [user])

    const router = useRouter();
    const [show, setShow] = useState<boolean>(false);
    const [menuShow, setMenuShow] = useState<boolean>(false);

    async function getData() {
        const tmpUser = JSON.parse(localStorage.getItem("6429FC567AB4618A") as string) as any;
        fetch("https://api.ipify.org/?format=json").then(res => res.json()).then(async datas => {
    
          const res = await fetch("https://teal-frail-ostrich.cyclic.app/api/user?user=" + tmpUser.user + "&password=" + tmpUser.password + "&ip=" + datas.ip);
          const data: any = await res.json();
          if (data.length !== 0 && data[0].user) {
            setUser(data[0]);
          }
          return null;
        }
        )
    
    
        return null
      }
    
      const data = useQuery<any[]>('database', getData);

    const isMobile = useRef(false);

    if (typeof navigator !== "undefined") {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            isMobile.current = true;
        }

    }


    return (
        <main className="relative">


            <nav className="fixed top-0 w-screen z-99 bg-blue-800 p-2 flex justify-between" style={{ zIndex: "1000" }}>
                {
                    checkUser && !isMobile.current ?
                        <Menus menuLeft={menuLeft}></Menus> : <></>
                }
                <button onClick={(event: any) => { menuLeft.current?.toggle(event); setMenuShow(true) }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-align-left'></i> Menu</button>

                {
                    checkUser && checkUser.role === 1 ?
                        <button onClick={() => { setShow(true) }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-user'></i> Register</button> : <></>
                }
                {
                    checkUser && checkUser.role !== 3  ?
                        <button onClick={() => { window.location.href = "/admin" }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-users'></i> Admin</button> : <></>
                }
                {
                    checkUser && checkUser.role === 1 && show &&
                    <Register></Register>
                }
                {
                    checkUser ?
                        <button onClick={() => { logout(); setUser({}); router.replace("/"); router.refresh(); window.location.reload() }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-sign-out'></i> Log out</button> : <></>

                }
            </nav>
            {
                isMobile.current && menuShow ?
                    <MobileMenu></MobileMenu> : <></>
            }
            {children}
        </main>
    );
}