import PropertyForm from "@/components/admin/property-form";
import SidebarLayout from "@/layouts/SideBarLayout";

const PropertyPage = () => {
    return <>
      <SidebarLayout >
      
            {/* Conteúdo principal */}
            <div className="flex-1 p-4 ml-64">
              {/* Título e descrição */}
              <PropertyForm />
            </div>
        </SidebarLayout>
    </> 

    
};

export default PropertyPage;


