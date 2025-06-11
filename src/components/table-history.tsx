import React from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

export interface Column {
   key: string;
   label: string;
}

export interface Row {
   key: string;
   [key: string]: any;
}

interface HistoryProps {
   columns?: Column[];
   rows: Row[];
}

export const TableHistory = (props: HistoryProps) => {
   const { columns, rows } = props;

   return (
      <div>
         <Table className={'max-h-[280px]'}>
            <TableHeader columns={columns}>
               {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows} emptyContent={"No rows to display."}>
               {(item) => (
                  <TableRow key={item.key}>
                     {/*// @ts-ignore*/}
                     {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </div>
   );
};
