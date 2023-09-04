
import { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';

export default function Navbar({
    children,
}: {
    children: React.ReactNode
}) {

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
        <main className="relative">
            <nav className="fixed top-0 w-screen z-99 bg-blue-500 p-2">
                <Button label="Menu" icon="pi pi-align-left" onClick={(event: any) => menuLeft.current?.toggle(event)} />
                <Menu model={items} popup ref={menuLeft} popupAlignment="left" />

            </nav>
            {children}
        </main>
    );
}