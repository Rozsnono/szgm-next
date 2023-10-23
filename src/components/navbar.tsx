
import { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import Menus from './menus';
import { Register } from './form';
import UserContext, { logout } from '@/context/user.context';
import { useRouter } from 'next/navigation';

export default function Navbar({
    children,
}: {
    children: React.ReactNode
}) {

    const menuLeft = useRef<Menu | null>(null);

    const { user, setUser } = useContext<any>(UserContext);

    const [checkUser, setCheckUser] = useState<any | null>(user);

    useEffect(() => { setCheckUser(user) }, [user])

    const router = useRouter();
    const [show, setShow] = useState<boolean>(false);

    return (
        <main className="relative">
            <nav className="fixed top-0 w-screen z-99 bg-blue-800 p-2 flex justify-between" style={{ zIndex: "1000" }}>
                {
                    checkUser ?
                        <Menus menuLeft={menuLeft}></Menus> : <></>
                }
                <button onClick={(event: any) => menuLeft.current?.toggle(event)} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-align-left'></i> Menu</button>

                {
                    checkUser && checkUser.role === 1 ?
                        <button onClick={() => { setShow(true) }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-user'></i> Register</button> : <></>
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
            {children}
        </main>
    );
}