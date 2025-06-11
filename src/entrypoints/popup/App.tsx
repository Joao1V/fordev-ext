import NotFound from '@/components/not-found.tsx';
import TabController from '@/components/tab-controller.tsx';
import PAGES from '@/app';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRouterStore } from '@/store/useRouterStore.ts';

function App() {
   const { route } = useRouterStore();

   return (
      <div className=" flex flex-col p-4 space-y-4 overflow-y-auto">
         <TabController />
         <Routes>
            {PAGES.map((route, index) => (
               <Route key={index} path={route.path} element={<route.element />} />
            ))}
            <Route path="/" element={<Navigate to={route} replace />} />
            <Route path="/popup.html" element={<Navigate to={route} replace />} />
            <Route path="*" element={<NotFound />} />
         </Routes>
      </div>
   );
}

export default App;
