
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';

export default function MenuS({menuLeft}: {menuLeft: Menu | null | any}){
    const router = useRouter();
    
    const items = [
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
        {
            label: '1. félév',
            items: [
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
        },{
            label: '3. félév',
            items: [
                {
                    label: 'MEMR',
                    icon: 'pi pi-calculator',
                    command: () => router.push('/memr')
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
        
    ];

    return(
        <Menu model={items} popup ref={menuLeft} popupAlignment="left" />
    );
}