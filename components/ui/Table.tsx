import { ReactNode, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  isSelected?: boolean;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

const TableWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const Table = ({ children, className = '', ...props }: TableProps) => {
  return (
    <table
      className={`min-w-full divide-y divide-gray-200 ${className}`}
      {...props}
    >
      {children}
    </table>
  );
};

const TableHeader = ({ children, className = '', ...props }: TableHeaderProps) => {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = '', ...props }: TableBodyProps) => {
  return (
    <tbody className={`divide-y divide-gray-200 bg-white ${className}`} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className = '', isSelected = false, ...props }: TableRowProps) => {
  return (
    <tr
      className={`
        transition-colors hover:bg-gray-50
        ${isSelected ? 'bg-brand-gold/5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = '', ...props }: TableHeadProps) => {
  return (
    <th
      className={`
        px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600
        ${className}
      `}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className = '', ...props }: TableCellProps) => {
  return (
    <td
      className={`
        whitespace-nowrap px-4 py-3 text-sm text-gray-900
        ${className}
      `}
      {...props}
    >
      {children}
    </td>
  );
};

export { TableWrapper, Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
