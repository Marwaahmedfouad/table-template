import React, { useMemo, useState, useEffect } from "react";
import { 
  useTable, 
  useFilters, 
  useGlobalFilter, 
  usePagination, 
  useRowSelect, 
  useSortBy 
} from "react-table";
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

function FilteringsortingTablePagSelecteddoupleclickhidden() {
const columns = useMemo(() => COLUMNS.filter(col => col.accessor !== 'id'), []);
  const data = useMemo(() => DATA, []);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColumnControls, setShowColumnControls] = useState(false);
  const [selectAllColumns, setSelectAllColumns] = useState(false);

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
    allColumns,
    state: { pageIndex, pageSize, globalFilter, selectedRowIds },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { 
        pageIndex: 0, 
        pageSize: 10,
        hiddenColumns: ['id']
          .filter(col => col.accessor !== 'selection')
          .slice(8) // Initially hide some columns
          .map(col => col.accessor)
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
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
          disableSortBy: true,
          width: 50,
        },
        ...columns,
      ]);
    }
  );

  const toggleAllColumns = () => {
    if (selectAllColumns) {
      const allColumnIds = allColumns
        .filter(column => column.id !== 'selection')
        .map(column => column.id);
      setHiddenColumns(allColumnIds);
    } else {
      setHiddenColumns([]);
    }
    setSelectAllColumns(!selectAllColumns);
  };

  useEffect(() => {
    const visibleColumnsCount = allColumns
      .filter(column => column.id !== 'selection' && !hiddenColumns.includes(column.id))
      .length;
    const allColumnsCount = allColumns.filter(column => column.id !== 'selection').length;
    setSelectAllColumns(visibleColumnsCount === allColumnsCount);
  }, [hiddenColumns, allColumns]);

  useEffect(() => {
    const initiallyHidden = allColumns
      .filter((column) => column.id !== "selection" && !column.isVisible)
      .map((column) => column.id);
    setHiddenColumns(initiallyHidden);
  }, [allColumns]);

  useEffect(() => {
    allColumns.forEach((column) => {
      if (column.id !== "selection") {
        column.toggleHidden(hiddenColumns.includes(column.id), true);
      }
    });
  }, [hiddenColumns, allColumns]);

  useEffect(() => {
    setSelectedRows(selectedFlatRows.map(row => row.original));
  }, [selectedFlatRows]);

  const handleRowDoubleClick = (row) => {
    alert(`Hello! Row ID: ${row.id}\nUser Data: ${JSON.stringify(row.original, null, 2)}`);
  };

  const toggleColumnVisibility = (columnId) => {
    setHiddenColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  return (
    <div className="table-container">
      <h5 className="table-title">
        Advanced Data Table 
      </h5>

      <div className="table-controls">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        
        <button 
          className="column-visibility-toggle"
          onClick={() => setShowColumnControls(!showColumnControls)}
        >
          {showColumnControls ? 'Hide Columns' : 'Show Columns'}
        </button>
      </div>

      {showColumnControls && (
        <div className="column-visibility-controls">
          <div className="visibility-header">
            <h4 className="visibility-title">Column Visibility</h4>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={selectAllColumns}
                  onChange={toggleAllColumns}
                  className="visibility-checkbox"
                />
                Select All
              </label>
            </div>
            <div className="selected-count">
              Selected: {Object.keys(selectedRowIds).length} rows
            </div>
          </div>
          <div className="column-checkboxes">
            {allColumns
              .filter((column) => column.id !== "selection")
              .map((column) => (
                <div key={column.id} className="column-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={!hiddenColumns.includes(column.id)}
                      onChange={() => toggleColumnVisibility(column.id)}
                      className="visibility-checkbox"
                    />
                    {column.render("Header")}
                  </label>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <div className="no-scroll-table-container">
        <table {...getTableProps()} className="no-scroll-data-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <React.Fragment key={headerGroup.getHeaderGroupProps().key}>
                <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
                  {headerGroup.headers.map(column => (
                    <th 
                      {...column.getHeaderProps(column.getSortByToggleProps())} 
                      className="header-cell"
                      style={{ width: column.width }}
                    >
                      <div className="header-content">
                        <span className="header-text">{column.render("Header")}</span>
                        {column.id !== 'selection' && (
                          <span className="sort-indicator">
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " ▼"
                                : " ▲"
                              : " ↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
                <tr className="filter-row">
                  {headerGroup.headers.map(column => (
                    <th key={column.id} style={{ width: column.width }}>
                      {column.canFilter && (
                        <div className="filter-content">
                          {column.render("Filter")}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr 
                  {...row.getRowProps()} 
                  className={`data-row ${row.isSelected ? "selected-row" : ""}`}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                >
                  {row.cells.map(cell => (
                    <td 
                      {...cell.getCellProps()}
                      className="data-cell"
                      style={{ width: cell.column.width }}
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

      <div className="pagination-controls">
        <div className="pagination-buttons">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
          </button>
        </div>
        
        <div className="pagination-info">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        </div>
        
        <div className="pagination-navigation">
          <span>Go to page:</span>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="page-input"
          />
        </div>
        
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          className="page-size-select"
        >
          {[5, 10, 20, 30, 50].map(size => (
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

export default FilteringsortingTablePagSelecteddoupleclickhidden;