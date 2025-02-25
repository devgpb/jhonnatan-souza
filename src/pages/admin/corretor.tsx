import BrokerForm from "@/components/admin/broker-form";
import { SideColumn } from "@/components/admin/side-column";
import SidebarLayout from "@/layouts/SideBarLayout";


const BrokerPage = () => {
    return <>
        <SidebarLayout>
        <div className="flex-1 p-4 ml-64">
            {/* Sidebar fixa no lado esquerdo */}
            <BrokerForm />
        </div>
        </SidebarLayout>
    </> 
};

export default BrokerPage;


