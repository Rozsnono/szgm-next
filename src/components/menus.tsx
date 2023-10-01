
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';

export default function MenuS({ menuLeft }: { menuLeft: Menu | null | any }) {
    const router = useRouter();

    function navigateTo(to: string) {
        router.push(to);
        sessionStorage.clear();
    }

    const items = [
        {
            label: 'Átlagszámítás',
            icon: 'pi pi-chart-bar',
            command: () => navigateTo('/atlag')
        },
        {
            label: 'Eredmények',
            icon: 'pi pi-percentage',
            command: () => router.push('/results/szgh')
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
            ]
        }, {
            label: '2. félév',
            items: [
                {
                    label: 'SZGH',
                    icon: 'pi pi-sitemap',
                    command: () => navigateTo('/szgh')
                },
                {
                    label: 'SZGH-ZH',
                    icon: 'pi pi-server',
                    command: () => navigateTo('/szgh-zh')
                },
                {
                    label: 'PMSZT',
                    icon: 'pi pi-database',
                    command: () => navigateTo('/pmszt')
                },
                {
                    label: 'RDSZ',
                    icon: 'pi pi-cog',
                    command: () => navigateTo('/rdsz')
                }
            ]
        }, {
            label: '3. félév',
            items: [
                // {
                //     template: () => <p className='p-2 ps-4 text-red-400'><i className='pi pi-spinner pi-spin'></i> MEMR</p>,
                // },
                {
                    label: 'MEMR',
                    icon: 'pi pi-calculator',
                    command: () => navigateTo('/memr')
                }
            ]
        }, {
            label: 'Kötelező nem szakmai',
            items: [
                {
                    label: 'FIZIKA TÖRI',
                    icon: 'pi pi-globe',
                    command: () => navigateTo('/fizika')
                }
            ]
        }, 
        

    ];

    return (
        <Menu model={items} popup ref={menuLeft} popupAlignment="left" />
    );
}