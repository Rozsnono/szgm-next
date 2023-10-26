
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';
import {Icons} from "../context/icons.enum"

export default function MenuS({ menuLeft }: { menuLeft: Menu | null | any }) {
    return (
        <Menu model={items} popup ref={menuLeft} popupAlignment="left" />
    );
}

export  function navigateTo(to: string) {
    window.location.href = to;
    sessionStorage.clear();
}

export const items = [
    {
        label: 'Átlagszámítás',
        icon: 'pi pi-chart-bar',
        command: () => navigateTo('/atlag')
    },
    {
        label: 'Eredmények',
        icon: 'pi pi-percentage',
        command: () => navigateTo('/results/szgh')
    },
    {
        label: 'Tárgyak',
        icon: 'pi pi-bookmark',
        command: () => navigateTo('/targyak')
    },
    {
        separator: true
    },
    {
        label: '1. félév',
        items: [
            {
                template: () => <p className='p-2 ps-4 line-through'><i className='pi pi-desktop'></i> SZGM</p>,
            },
            {
                label: 'Matek 1',
                icon: Icons['Matek 1'],
                command: () => navigateTo('/matek1')
            },
        ]
    }, {
        label: '2. félév',
        items: [
            {
                label: 'SZGH',
                icon: Icons['SZGH'],
                command: () => navigateTo('/szgh')
            },
            {
                label: 'SZGH-ZH',
                icon: Icons['SZGH-ZH'],
                command: () => navigateTo('/szgh-zh')
            },
            {
                label: 'PMSZT',
                icon: Icons['PMSZT'],
                command: () => navigateTo('/pmszt')
            },
            {
                label: 'RDSZ',
                icon: Icons['RDSZ'],
                command: () => navigateTo('/rdsz')
            },
            {
                label: 'Matek 2',
                icon: Icons['Matek 2'],
                command: () => navigateTo('/matek2')
            },
        ]
    }, {
        label: '3. félév',
        items: [
            // {
            //     template: () => <p className='p-2 ps-4 text-red-400'><i className='pi pi-spinner pi-spin'></i> MEMR</p>,
            // },
            {
                label: 'MEMR',
                icon: Icons['MEMR'],
                command: () => navigateTo('/memr')
            },
            {
                label: 'VÁLLALAT',
                icon: Icons['VÁLLALAT'],
                command: () => navigateTo('/vallalat')
            },
            {
                label: 'ADATBÁZIS',
                icon: Icons['ADATBÁZIS'],
                command: () => navigateTo('/adatbazis')
            },
            {
                template: () => <p className='p-2 ps-4 text-red-400'><i className='pi pi-spinner pi-spin'></i> Matek 3</p>,
            },
        ]
    }, {
        label: 'Kötelező nem szakmai',
        items: [
            {
                label: 'FIZIKA TÖRI',
                icon: Icons['FIZIKA TÖRI'],
                command: () => navigateTo('/fizika')
            }
        ]
    }, 
    

];