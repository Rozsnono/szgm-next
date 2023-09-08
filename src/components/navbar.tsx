
import { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import Menus from './menus';

export default function Navbar({
    children,
}: {
    children: React.ReactNode
}) {

    const menuLeft = useRef<Menu | null>(null);

    return (
        <main className="relative">
            <nav className="fixed top-0 w-screen z-99 bg-blue-800 p-2" style={{zIndex: "1000"}}>
                <button onClick={(event: any) => menuLeft.current?.toggle(event)}  className='px-4 py-2 border-2 rounded-xl border-blue-800 hover:border-blue-900 hover:bg-blue-900 text-white'><i className='pi pi-align-left'></i> Menu</button>
                <Menus menuLeft={menuLeft}></Menus>

            </nav>
            {children}
        </main>
    );
}