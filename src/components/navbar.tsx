
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
            <nav className="fixed top-0 w-screen z-99 bg-blue-500 p-2">
                <Button label="Menu" icon="pi pi-align-left" onClick={(event: any) => menuLeft.current?.toggle(event)} />
                <Menus menuLeft={menuLeft} ></Menus>

            </nav>
            {children}
        </main>
    );
}