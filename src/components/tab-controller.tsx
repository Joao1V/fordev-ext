import { useEffect } from 'react';
import { ScrollShadow, Tab, Tabs } from '@heroui/react';
import { useRouterStore } from '@/store/useRouterStore';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TabController() {
   const navigate = useNavigate();
   const location = useLocation();
   const currentPath = location.pathname.substring(1); // Remove a / do início
   const { route, setRoute } = useRouterStore();

   const handleTabChange = (key: string) => {
      setRoute(key);
      navigate(key);
   };

   useEffect(() => {
      handleTabChange(route);
   }, []);

   return (
      <div className="flex justify-center flex-wrap gap-4 ">
         <Tabs
            variant={'solid'}
            selectedKey={currentPath || 'form'}
            onSelectionChange={(key) => handleTabChange(`/${key}`)}
         >
            <Tab key="form" title="Formulário" />
            <Tab key="cpf" title="CPF" />
            <Tab key="cnpj" title="CNPJ" />
            <Tab key="cep" title="CEP" />
            {/*<Tab key="person" title="Pessoa" />*/}
         </Tabs>
      </div>
   );
}
