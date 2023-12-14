
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';
import { Icons } from "../context/icons.enum"

export default function MenuS({ menuLeft }: { menuLeft: Menu | null | any }) {

    return (
        <></>
        // <Menu model={items} popup ref={menuLeft} popupAlignment="left" />
    );
}

export function navigateTo(to: string) {
    window.location.href = to;
    sessionStorage.clear();
}

export const urls = ["/atlag","/targyak"];


export const items = [
    {
        label: 'Átlagszámítás',
        icon: 'pi pi-chart-bar',
        link: '/atlag'
    },
    {
        label: 'Eredmények',
        icon: 'pi pi-percentage',
        link: '/results'
    },
    {
        label: 'Tárgyak',
        icon: 'pi pi-bookmark',
        link: '/targyak'
    },
    {
        label: 'Üzenetek',
        icon: 'pi pi-whatsapp',
        error: true,
        link: '/'
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
                link: '/matek1',
                type: "study"
            },
        ]
    }, {
        label: '2. félév',
        items: [
            {
                label: 'SZGH',
                icon: Icons['SZGH'],
                link: '/szgh',
                type: "test"
            },
            {
                label: 'SZGH-ZH',
                icon: Icons['SZGH-ZH'],
                link: '/szgh-zh',
                type: "study"
            },
            {
                label: 'PMSZT',
                icon: Icons['PMSZT'],
                link: '/pmszt',
                type: "test"
            },
            {
                label: 'RDSZ',
                icon: Icons['RDSZ'],
                link: '/rdsz',
                type: "test"
            },
            {
                label: 'Matek 2',
                icon: Icons['Matek 2'],
                link: '/matek2',
                type: "study"
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
                link: '/memr',
                type: "test"
            },
            {
                label: 'MEMR ZH',
                icon: Icons['MEMR'],
                link: '/memr-zh/5',
                type: "study"
            },
            {
                label: 'MEMR VIZSGA',
                icon: Icons['MEMR'],
                link: '/memr-vizsga',
                type: "study"
            },
            {
                label: 'VÁLLALAT',
                icon: Icons['VÁLLALAT'],
                link: '/vallalat',
                type: "test"
            },
            {
                label: 'ADATBÁZIS',
                icon: Icons['ADATBÁZIS'],
                link: '/adatbazis',
                type: "study"
            },
            {
                label: 'Matek 3',
                icon: Icons['Matek 3'],
                link: '/matek3',
                type: "study"
            },
        ]
    },
    {
        label: '4. félév',
        items: [
            {
                label: 'MI',
                icon: Icons['MI'],
                link: '/mi',
                type: "study"
            }
        ]
    },
    {
        label: 'Kötelező nem szakmai',
        items: [
            {
                label: 'FIZIKA TÖRI',
                icon: Icons['FIZIKA TÖRI'],
                link: '/fizika',
                type: "study"
            }
        ]
    },


];