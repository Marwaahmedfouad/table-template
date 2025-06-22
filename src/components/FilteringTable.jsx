import React, { useMemo } from "react";
import { useTable, useFilters } from "react-table";
import DATA from "../Data.json";
import COLUMNS from "./Columns";

// Default filter UI component
const DefaultColumnFilter = ({
  column: { filterValue, setFilter },
}) => {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search...`}
      style={{
        width: "100%",
        padding: "4px",
        marginTop: "4px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    />
  );
};

function FilteringTable() {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <>
      <h5 style={{ color: "pink" }}>FilteringTable</h5>
      <table {...getTableProps()} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "left" }}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
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
                  <td {...cell.getCellProps()} style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default FilteringTable;