import { items } from "./menus";

export default function Home() {
    return (
        <main className="fixed w-screen h-screen bg-white z-10 flex flex-col items-center pt-6 gap-2" style={{ zIndex: "1001" }}>

            {
                items.map((item: any, index: number) => {
                    return (
                        <>
                            {
                                !item.items && !item.separator ?
                                    <div onClick={item.command} key={index} className="p-3 px-4 rounded-full border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"><i className={item.icon}></i> {item.label}</div> :
                                    item.items && !item.separator ?
                                        <Menus items={item.items.filter((item: any) => !item.template)} label={item.label}></Menus>
                                        :
                                        <div className="h-10"></div>
                            }
                        </>
                    )
                })
            }
        </main>
    );
}


function Menus({ items, label }: any) {
    return (
        <main className="flex flex-col justify-center items-center">
            <div className="">{label}</div>
            <div className="flex gap-2 items-center">
                {
                    items.map((item: any, index: number) => {
                        return (
                            <div onClick={item.command} key={index} className="p-3 px-3 flex items-center rounded-full border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white"><i className={item.icon}></i></div>
                        )
                    })
                }

            </div>
        </main>
    );
}