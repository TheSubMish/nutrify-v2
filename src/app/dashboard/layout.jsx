import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default function Layout({ children }){
    return (
        <>
            <div className="flex h-screen bg-background">
                <AppSidebar />
                <main className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </>
    )
}