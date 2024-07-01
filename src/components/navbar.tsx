
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

    const [showNotLogin, setShowNotLogin] = useState<boolean>(false);

    async function getData(): Promise<any> {

        let data = { ip: "1.1.1.1" };
        try {
            const res = await fetch("https://api.ipify.org/?format=json");
            data = await res.json();
        } catch (error) {
            data = { ip: "0.0.0.0" };
        }

        setTimeout(() => { setShowNotLogin(true) }, 2000);


        const tmpUser = JSON.parse(localStorage.getItem("6429FC567AB4618A") as string) as any;
        if (!tmpUser) {
            setUser(null);
            return null;
        };
        const res2 = await fetch("https://szgm-next-server.onrender.com/api/user?user=" + tmpUser.user + "&password=" + tmpUser.password + "&ip=" + data.ip);
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
        setMenu(false)
    }

    const [type, setType] = useState<string>("study");

    return (

        <main className="relative">


            <nav className="fixed top-0 w-screen z-99  bg-red-800 p-2 flex justify-between" style={{ zIndex: "1000" }}>
                <button onClick={(event: any) => { setMenu(true); setMenuShow(true) }} className='px-4 py-2 border-2 rounded-xl border-blue-800 border-red-800 hover:border-blue-900 hover:border-red-900 hover:bg-blue-900 hover:bg-red-900 text-white'><i className='pi pi-align-left'></i> Menu</button>

                {
                    checkUser && checkUser.role < 3 ?
                        <button onClick={() => { router.replace("/admin"); }} className='px-4 py-2 border-2 rounded-xl border-blue-800 border-red-800 hover:border-blue-900 hover:border-red-900 hover:bg-blue-900 hover:bg-red-900 text-white'><i className='pi pi-users'></i></button> : <></>
                }
                {
                    checkUser && checkUser.role === 1 && show &&
                    <Register></Register>
                }
                {
                    checkUser ?
                        <button onClick={() => { logout(); setUser({}); router.replace("/"); router.refresh(); window.location.reload() }} className='px-4 py-2 border-2 rounded-xl border-blue-800 border-red-800 hover:border-blue-900 hover:border-red-900  hover:bg-blue-900 hover:bg-red-900 text-white'><i className='pi pi-sign-out'></i> Log out</button> :
                        <button onClick={() => { router.replace("/login"); }} className='px-4 py-2 border-2 rounded-xl border-blue-800 border-red-800 hover:border-blue-900 hover:border-red-900  hover:bg-blue-900 hover:bg-red-900 text-white'><i className='pi pi-sign-in'></i> Log in</button>

                }
            </nav>
            <Sidebar visible={menu} onHide={() => setMenu(false)} className='w-screen bg-white text-gray-900 ' style={isMobile.current ? { width: "100vw" } : { width: "25rem" }}>
                <div className='grid grid-cols-2 gap-2 relative select-none overflow-hidden '>
                    <div onClick={() => { navigateTo("/"); setMenu(false) }} className={`p-3 col-span-2 cursor-pointer px-4 rounded-full border-2 border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white duration-200`}><i className="pi pi-chart-bar"></i> Főoldal</div>

                    <hr className='col-span-2' />

                    <div onClick={() => { navigateTo("/average"); setMenu(false) }} className={`p-3 cursor-pointer px-4 rounded-full border-2 border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white duration-200`}><i className="pi pi-chart-bar"></i> Átlag</div>
                    <div onClick={() => { navigateTo("/subjects"); setMenu(false) }} className={`p-3 cursor-pointer px-4 rounded-full border-2 border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white duration-200`}><i className="pi pi-book"></i> Tárgyak</div>

                    {
                        checkUser &&
                        <>
                            <div onClick={() => { navigateTo("/results"); setMenu(false) }} className={`p-3 cursor-pointer px-4 rounded-full border-2 border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white duration-200`}><i className="pi pi-percentage"></i> Eredmények</div>
                            <div onClick={() => { navigateTo("/subjects-planner"); setMenu(false) }} className={`p-3 cursor-pointer px-4 rounded-full border-2 border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white duration-200`}><i className="pi pi-calendar"></i> Órarendtervező</div>
                        </>
                    }

                    <hr className='col-span-2' />

                    {
                        checkUser && checkUser.role != 4 &&
                        <>
                            <div onClick={() => { setType("test") }} className={`p-3 select-none px-4 rounded-full ${type == 'study' ? 'border-b-2 border-gray-500 text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'border-b-2 border-blue-800 border-red-800  bg-red-800 text-white'} duration-200`}><i className="pi pi-question"></i> Tesztek</div>
                            <div onClick={() => { setType("study") }} className={`p-3 select-none px-4 rounded-full ${type == 'test' ? 'border-b-2 border-gray-500 text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer' : 'border-b-2 border-blue-800 border-red-800  bg-red-800 text-white'} duration-200`}><i className="pi pi-file"></i> Anyagok</div>
                        </>
                    }



                    <Tooltip target=".menu-items">
                    </Tooltip>

                    {
                        checkUser &&
                        <div className={'col-span-2 flex flex-col gap-2 mt-4 ' + (type + "-animation")}>
                            <main className="flex flex-col justify-center items-center col-span-2">
                                <div className="">1. félév</div>
                                <div className="flex gap-2 items-center">
                                    {
                                        type === "study" ?
                                            <>
                                                <div onClick={() => { navigateTo("/matek1") }} data-pr-tooltip={"Matek 1"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-plus-circle"></i></div>
                                            </> :
                                            <>
                                            </>
                                    }
                                </div>
                            </main>

                            <main className="flex flex-col justify-center items-center col-span-2">
                                <div className="">2. félév</div>
                                <div className="flex gap-2 items-center">
                                    {
                                        type === "study" ?
                                            <>
                                                <div onClick={() => { navigateTo("/matek2") }} data-pr-tooltip={"Matek 2"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-plus-circle"></i></div>
                                                <div onClick={() => { navigateTo("/szgh-zh") }} data-pr-tooltip={"SZGH"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-server"></i></div>
                                                <div onClick={() => { navigateTo("/szgh-answers") }} data-pr-tooltip={"SZGH-GYAK"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-server"></i></div>
                                                <div onClick={() => { navigateTo("/pmszt-vizsga") }} data-pr-tooltip={"PMSZT"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-file"></i></div>
                                            </> :
                                            <>
                                                <div onClick={() => { navigateTo("/szgh") }} data-pr-tooltip={"SZGH"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-server"></i></div>
                                                <div onClick={() => { navigateTo("/rdsz") }} data-pr-tooltip={"RDSZ"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-cog"></i></div>
                                                <div onClick={() => { navigateTo("/pmszt") }} data-pr-tooltip={"PMSZT"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-file"></i></div>
                                            </>
                                    }
                                </div>
                            </main>

                            <main className="flex flex-col justify-center items-center col-span-2">
                                <div className="">3. félév</div>
                                <div className="flex gap-2 items-center">
                                    {
                                        type === "study" ?
                                            <>
                                                <div onClick={() => { navigateTo("/matek3") }} data-pr-tooltip={"Matek 3"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-plus-circle"></i></div>
                                                <div onClick={() => { navigateTo("/memr-zh") }} data-pr-tooltip={"MEMR RÖVID"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-calculator"></i></div>
                                                <div onClick={() => { navigateTo("/memr-vizsga") }} data-pr-tooltip={"MEMR TELJES"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-calculator"></i></div>
                                                <div onClick={() => { navigateTo("/database") }} data-pr-tooltip={"ADATBÁZIS"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-database"></i></div>
                                            </> :
                                            <>
                                                <div onClick={() => { navigateTo("/memr") }} data-pr-tooltip={"MEMR"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-calculator"></i></div>
                                                <div onClick={() => { navigateTo("/company") }} data-pr-tooltip={"VÁLLALAT"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-chart-line"></i></div>
                                            </>
                                    }
                                </div>
                            </main>

                            <main className="flex flex-col justify-center items-center col-span-2">
                                <div className="">4. félév</div>
                                <div className="flex gap-2 items-center">
                                    {
                                        type === "study" ?
                                            <>
                                                <div onClick={() => { navigateTo("/mi") }} data-pr-tooltip={"MI"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-android"></i></div>
                                                <div onClick={() => { navigateTo("/physics-info") }} data-pr-tooltip={"FIZIKA INFO"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-globe"></i></div>
                                                <div onClick={() => { navigateTo("/statistic") }} data-pr-tooltip={"STATISZTIKA"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-chart-line"></i></div>
                                            </> :
                                            <>
                                                <div onClick={() => { navigateTo("/physics-answers") }} data-pr-tooltip={"FIZIKA INFO"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-globe"></i></div>
                                            </>
                                    }
                                </div>
                            </main>

                            <main className="flex flex-col justify-center items-center col-span-2">
                                <div className="">Kötelező nem szakmai</div>
                                <div className="flex gap-2 items-center">
                                    {
                                        type === "study" ?
                                            <>
                                                <div onClick={() => { navigateTo("/physics") }} data-pr-tooltip={"FIZIKA TÖRI"} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800"}><i className="pi pi-globe"></i></div>
                                            </> :
                                            <></>
                                    }
                                </div>
                            </main>
                        </div>
                    }
                    {/* {
                        !checkUser ?
                            items.filter((item: any) => { return urls.includes(item.link) }).map((item: any, index: number) => {
                                return (
                                    <div key={index}>
                                        <div onClick={() => { navigateTo(item.link); setMenu(false) }} key={index} className={`p-3 cursor-pointer px-4 rounded-full border-2 ${item.error ? "border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white" : "border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white"}`}><i className={item.icon}></i> {item.label}</div>
                                    </div>
                                )
                            })
                            :
                            items.map((item: any, index: number) => {
                                return (
                                    <div key={index} className={!item.items && !item.separator ? "" : "col-span-2 flex flex-wrap justify-center"}>
                                        {
                                            !item.items && !item.separator ?
                                                <div onClick={() => { navigateTo(item.link); setMenu(false) }} key={index} className={`p-3 px-4 rounded-full border-2 ${item.type == "switcher" ? "bg-red-500" : ""} ${item.error ? "border-blue-800 border-red-800 text-blue-800 text-red-800" : "border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800 hover:text-white cursor-pointer"}`}><i className={item.icon}></i> {item.label}</div> :
                                                item.items && !item.separator ?
                                                    <MenusItem items={item.items.filter((item: any) => !item.template && item.type != "study")} label={item.label} onClick={(e) => { navigateTo(e); setMenu(false) }}></MenusItem>
                                                    :
                                                    <div className="h-10 col-span-2 "></div>
                                        }
                                    </div>
                                )
                            })
                    } */}
                </div>
            </Sidebar>

            {
                (data.isLoading && user !== null) &&
                <main className="fixed top-0 p-2 flex flex-col items-center  w-screen h-screen bg-[#00000040]" style={{ zIndex: 1001 }}>
                    <div className="mx-auto flex flex-col bg-white border-2 border-red-800 border-red-800 gap-6 p-6 rounded-lg h-fit" >
                        {/* <i className="pi pi-spin pi-spinner" style={{ fontSize: "3rem" }}></i> */}
                        <div className="loader"></div>
                    </div>

                    {
                        showNotLogin &&
                        <div className="mx-auto flex item-center justify-center mt-16">
                            <button onClick={() => { data.remove(); setUser(null) }} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-bold text-red-700 rounded-lg group bg-gradient-to-br from-red-900 to-rose-500 group-hover:from-red-600 group-hover:to-rose-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                                    Belépés nélkül
                                </span>
                            </button>
                        </div>
                    }
                </main>
            }

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
                            <div key={index}>
                                {
                                    item.separator ?
                                        <div className='h-10 border border-gray-500'></div> :
                                        <div onClick={() => { onClick(item.link); }} data-pr-tooltip={item.label} data-pr-position={"top"} className={"p-3 menu-items cursor-pointer px-3 flex items-center rounded-full border-2 hover:text-white" + (item.type == "test" ? " border-green-800 text-green-800 hover:bg-green-800" : " border-blue-800 border-red-800 text-blue-800 text-red-800 hover: hover:bg-red-800")}><i className={item.icon}></i></div>
                                }
                            </div>
                        )
                    })
                }
                <Tooltip target=".menu-items">
                </Tooltip>
            </div>
        </main>
    );
}