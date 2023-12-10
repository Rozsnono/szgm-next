
import { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { items } from './menus';
import { Register } from './form';
import { Sidebar } from 'primereact/sidebar';
import UserContext, { logout } from '@/context/user.context';
import { useRouter } from 'next/navigation';

import { useQuery } from 'react-query';
import { Tooltip } from 'primereact/tooltip';
import { urls } from './menus';

export default function Navbar({
    children,
}: {
    children: React.ReactNode
}) {

    const menuLeft = useRef<Menu | null>(null);
    const [menu, setMenu] = useState<boolean>(false);

    const { user, setUser } = useContext<any>(UserContext);

    const [checkUser, setCheckUser] = useState<any | null>(user);

    useEffect(() => { setCheckUser(user); }, [user])

    const router = useRouter();
    const [show, setShow] = useState<boolean>(false);
    const [menuShow, setMenuShow] = useState<boolean>(false);

    async function getData(): Promise<any> {

        let data = { ip: "1.1.1.1" };
        try {
            const res = await fetch("https://api.ipify.org/?format=json");
            data = await res.json();
        } catch (error) {
            data = { ip: "0.0.0.0" };
        }

        const tmpUser = JSON.parse(localStorage.getItem("6429FC567AB4618A") as string) as any;
        if (!tmpUser) {
            setUser(null);
            return null;
        };
        const res2 = await fetch("https://szgm-next-server-production.up.railway.app/api/user?user=" + tmpUser.user + "&password=" + tmpUser.password + "&ip=" + data.ip);
        const data2 = await res2.json();

        if (data2.length !== 0 && data2[0].user) {
            setUser(data2[0]);
            return data2[0];
        }


    }

    const data = useQuery<any[]>('database', getData);

    const isMobile = useRef(false);

    if (typeof navigator !== "undefined") {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            isMobile.current = true;
        }

    }

    function navigateTo(to: string) {
        router.push(to);
    }

    return (

        <main className="relative">


            <nav className="fixed top-0 w-screen z-99 bg-blue-800 p-2 flex justify-between" style={{ zIndex: "1000" }}>
                <button onClick={(event: any) => { setMenu(true); setMenuShow(true) }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-align-left'></i> Menu</button>

                {
                    checkUser && checkUser.role === 1 ?
                        <button onClick={() => { setShow(true) }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-user'></i></button> : <></>
                }
                {
                    checkUser && checkUser.role !== 3 ?
                        <button onClick={() => {  router.replace("/admin"); }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-users'></i></button> : <></>
                }
                {
                    checkUser && checkUser.role === 1 && show &&
                    <Register></Register>
                }
                {
                    checkUser ?
                        <button onClick={() => { logout(); setUser({}); router.replace("/"); router.refresh(); window.location.reload() }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-sign-out'></i> Log out</button> : 
                        <button onClick={() => { router.replace("/login"); }} className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-sign-in'></i> Log in</button>

                }
            </nav>
            <Sidebar visible={menu} onHide={() => setMenu(false)} className='w-screen' style={checkUser && isMobile.current && { width: "100vw" }}>
                <div className='grid grid-cols-2 gap-2 relative'>
                    {
                        !checkUser ?
                        items.filter((item: any) => { return urls.includes(item.link) }).map((item: any, index: number) => {
                            return (
                                <div key={index}>
                                    <div onClick={() => { navigateTo(item.link); setMenu(false) }} key={index} className="p-3 cursor-pointer px-4 rounded-full border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"><i className={item.icon}></i> {item.label}</div>
                                </div>
                            )
                        }) 
                        :
                        items.map((item: any, index: number) => {
                            return (
                                <div key={index} className={!item.items && !item.separator ? "" : "col-span-2"}>
                                    {
                                        !item.items && !item.separator  ?
                                            <div onClick={() => { navigateTo(item.link); setMenu(false) }} key={index} className="p-3 cursor-pointer px-4 rounded-full border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"><i className={item.icon}></i> {item.label}</div> :
                                            item.items && !item.separator ?
                                                <MenusItem items={item.items.filter((item: any) => !item.template )} label={item.label} onClick={(e) => { navigateTo(e); setMenu(false) }}></MenusItem>
                                                :
                                                <div className="h-10 col-span-2 "></div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Sidebar>
            {children}
        </main>
    );
}

function MenusItem({ items, label, onClick }: { items: any, label: string, onClick: (e: any) => void }) {


    return (
        <main className="flex flex-col justify-center items-center col-span-2">
            <div className="">{label}</div>
            <div className="flex gap-2 items-center">
                {
                    items.map((item: any, index: number) => {
                        return (
                            <div onClick={() => { onClick(item.link); }} key={index} data-pr-tooltip={item.label} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white" + (item.type == "test" ? " border-green-800 text-green-800 hover:bg-green-800" : " border-blue-800 text-blue-800 hover:bg-blue-800")}><i className={item.icon}></i></div>
                        )
                    })
                }
                <Tooltip target=".menu-items">
                </Tooltip>
            </div>
        </main>
    );
}