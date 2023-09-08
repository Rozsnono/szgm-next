

export default function Loading(){
    return (
        <main className="min-h-screen min-w-screen bg-white">
            <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
                <i className="pi pi-spinner pi-spin text-gray-500" style={{fontSize: "5rem"}}></i>  
            </div>
        </main>
    );
}