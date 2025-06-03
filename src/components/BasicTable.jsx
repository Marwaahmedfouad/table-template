import React, { useMemo } from "react";
import { useTable } from "react-table";
import DATA from "../Data.json";
import COLUMNS from "./Columns";

function BasicTable() {
  //useMemo is used to memoize the result of a computation
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  console.log(tableInstance);

  return (
    <>
      <h5 style={{ color: "pink" }}>BasicTable</h5>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default BasicTable;
