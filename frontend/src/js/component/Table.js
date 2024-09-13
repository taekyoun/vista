import React from 'react';
import { useTable, useExpanded  } from 'react-table';
import style from 'css/component/Table.module.css'
const Table = ({ columns, data, onRowClick}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useExpanded 
    );
  
    return (
        <table {...getTableProps()} className={style.table}>
            <thead>
                {headerGroups.map((headerGroup,headerGroupIndex) => (
                    <tr {...headerGroup.getHeaderGroupProps()} className={style.table_header} key={headerGroupIndex}>
                        {headerGroup.headers.map((column,columnIndex) => (
                            <th {...column.getHeaderProps()} className={`${style.table_header_cell} ${column.className || ''}`}  key={columnIndex}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()} className={style.table_body}>
                {rows.map((row,rowIndex) => {
                    prepareRow(row);
                    return (
                        <React.Fragment  key={rowIndex}>
                            <tr {...row.getRowProps()} className={style.table_row}  key={rowIndex}   onClick={onRowClick ? () => onRowClick(row.original) : null} >
                                {row.cells.map((cell,cellIndex) => 
                                    (
                                        <td {...cell.getCellProps()} className={`${style.table_cell} ${cell.column.className || ''}`} key={cellIndex}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                )}
                            </tr>
                            {row.isExpanded && row.original.subMenu && (
                                <tr key={`subMenu-${rowIndex}`}>
                                    <td colSpan={columns.length} style={{ paddingLeft: '20px' }}>
                                        <Table columns={columns} data={row.original.subMenu} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};


export default Table