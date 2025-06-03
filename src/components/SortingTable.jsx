import React, { useMemo } from "react";
import { useSortBy, useTable } from "react-table";
import DATA from "../Data.json";
import COLUMNS from "./Columns";

function SortingTable() {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);
  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <>
      <h5 style={{ color: "pink" }}>SortingTable</h5>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{column.render("Header")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        textAlign: "center",
                        fontSize: "16px",
                        lineHeight: "16px",
                        marginLeft: "4px",
                      }}
                    >
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "▼"
                          : "▲"
                        : "↕"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
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

export default SortingTable;
