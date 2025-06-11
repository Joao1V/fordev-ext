import PageCep from './cep/page';
import PageCnpj from './cnpj/page';
import PageCpf from './cpf/page';
import PageForm from './form/page';

export { PageCep, PageCpf, PageCnpj, PageForm };

const PAGES = [
   {
      path: '/form',
      element: PageForm,
   },
   {
      path: '/cep',
      element: PageCep,
   },
   {
      path: '/cpf',
      element: PageCpf,
   },
   {
      path: '/cnpj',
      element: PageCnpj,
   },
];

export default PAGES;
