import React, { useMemo, useState } from "react";
import { useTable, useFilters, useGlobalFilter, usePagination, useRowSelect } from "react-table";
import DATA from "../Data.json";
import COLUMNS from "./Columns";

const DefaultColumnFilter = ({ column: { filterValue, setFilter, id } }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder={`Search ${id}...`}
    className="column-filter-input"
  />
);

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <div className="global-filter">
    <input
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder="Search all columns..."
      className="global-filter-input"
    />
  </div>
);

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return <input type="checkbox" ref={resolvedRef} {...rest} />;
  }
);

function FilteringTablePagSelecteddoupleclick() {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, []);
  const [selectedRows, setSelectedRows] = useState([]);

  const defaultColumn = useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, globalFilter, selectedRowIds },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  React.useEffect(() => {
    setSelectedRows(selectedFlatRows.map(row => row.original));
  }, [selectedFlatRows]);

  const handleRowDoubleClick = (row) => {
    alert(`Hello! Row ID: ${row.id}\nUser Data: ${JSON.stringify(row.original, null, 2)}`);
  };

  return (
    <div className="table-container">
      <h5 style={{ color: "pink", marginBottom: "16px" }}>Global Filtering Table with Pagination & Selection & Doupleclick</h5>

      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      
      <div className="selected-count">
        Selected: {Object.keys(selectedRowIds).length} rows
      </div>
      
      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>{column.render("Header")}</div>
                  {column.canFilter ? column.render("Filter") : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr 
                {...row.getRowProps()} 
                className={row.isSelected ? "selected-row" : ""}
                onDoubleClick={() => handleRowDoubleClick(row)}
                style={{ cursor: 'pointer' }}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {selectedRows.length > 0 && (
        <div className="selected-data-preview">
          <h3>Selected Rows Data:</h3>
          <pre>
            {JSON.stringify(selectedRows, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default FilteringTablePagSelecteddoupleclick;