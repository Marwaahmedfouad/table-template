import React, { useMemo } from "react";
import { useTable, useFilters, useGlobalFilter } from "react-table";
import DATA from "../Data.json";
import COLUMNS from "./Columns";

// Define a default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, setFilter, id },
}) => {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${id}...`}
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

// Global filter component
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <input
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search all columns...`}
        style={{
          width: "300px",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};

function GlobalFilteringTable() {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useGlobalFilter
  );

  return (
    <div style={{ padding: "16px" }}>
      <h5 style={{ color: "pink", marginBottom: "16px" }}>Global Filtering Table</h5>
      
      {/* Global filter input */}
      <GlobalFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      
      <table
        {...getTableProps()}
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
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
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GlobalFilteringTable;