

export default function Loading(){
    return (
        <main className="min-h-screen w-screen bg-white absolute top-0 left-0">
            <div className="flex items-center min-h-screen p-4 bg-gray-100 justify-center">
                <i className="pi pi-spinner pi-spin text-gray-500" style={{fontSize: "5rem"}}></i>  
            </div>
        </main>
    );
}