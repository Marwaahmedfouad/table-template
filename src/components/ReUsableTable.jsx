import React, { useMemo, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
} from "react-table";

// 1. Helper Components
const DefaultColumnFilter = ({ column: { filterValue, setFilter, id } }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder={`Search ${id}...`}
    className="filter-input"
  />
);

const GlobalFilter = ({ value, onChange }) => (
  <input
    value={value || ""}
    onChange={(e) => onChange(e.target.value || undefined)}
    placeholder="Search all columns..."
    className="global-filter-input"
  />
);

const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

// 2. Column Visibility Controls Component
const ColumnControls = ({ allColumns, hiddenColumns, setHiddenColumns }) => {
  const [selectAll, setSelectAll] = useState(false);

  const toggleAllColumns = () => {
    if (selectAll) {
      const allColumnIds = allColumns
        .filter(col => col.id !== "selection")
        .map(col => col.id);
      setHiddenColumns(allColumnIds);
    } else {
      setHiddenColumns([]);
    }
    setSelectAll(!selectAll);
  };

  const toggleColumn = (columnId) => {
    setHiddenColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId) 
        : [...prev, columnId]
    );
  };

  return (
    <div className="column-controls">
      <div className="control-header">
        <h4>Column Visibility</h4>
        <label>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleAllColumns}
          />
          Select All
        </label>
      </div>
      <div className="column-checkboxes">
        {allColumns
          .filter(column => column.id !== "selection")
          .map(column => (
            <div key={column.id} className="column-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={!hiddenColumns.includes(column.id)}
                  onChange={() => toggleColumn(column.id)}
                />
                {column.render("Header")}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};

// 3. Pagination Controls Component
const PaginationControls = ({
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  setPageSize,
  pageSize,
  pageSizeOptions,
}) => (
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

    <span className="page-info">
      Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
    </span>

    <div className="page-navigation">
      <span>Go to page:</span>
      <input
        type="number"
        defaultValue={pageIndex + 1}
        onChange={e => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          gotoPage(page);
        }}
        min={1}
        max={pageOptions.length}
      />
    </div>

    <select
      value={pageSize}
      onChange={e => setPageSize(Number(e.target.value))}
    >
      {pageSizeOptions.map(size => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>
  </div>
);

// 4. Main Table Component
const ReUsableTable = ({
  columns: userColumns,
  data,
  title = "Data Table",
  initialState = {},
  onRowClick,
  showGlobalFilter = true,
  showColumnControls = true,
  showSelectedPreview = true,
  pageSizeOptions = [5, 10, 20, 30, 50],
  defaultPageSize = 10,
  className = "",
  isLoading = false,
}) => {
  // Add row selection column
  const columns = useMemo(() => [
    {
      id: "selection",
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <Checkbox {...getToggleAllPageRowsSelectedProps()} />
      ),
      Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
      disableSortBy: true,
      width: 50,
    },
    ...userColumns,
  ], [userColumns]);

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);

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
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { 
        pageIndex: 0,
        pageSize: defaultPageSize,
        ...initialState,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  );

  const selectedRows = useMemo(() => 
    selectedFlatRows.map(row => row.original),
    [selectedFlatRows]
  );

  // Fixed useEffect hooks to prevent infinite loops
  useEffect(() => {
    // Set initial hidden columns only once when component mounts
    if (initialState.hiddenColumns) {
      setHiddenColumns(initialState.hiddenColumns);
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Apply column visibility only when hiddenColumns changes
    allColumns.forEach(column => {
      if (column.id !== "selection") {
        column.toggleHidden(hiddenColumns.includes(column.id));
      }
    });
  }, [hiddenColumns]); // Only run when hiddenColumns changes

  return (
    <div className={`table-container ${className}`}>
      <h2 className="table-title">{title}</h2>

      {/* Table Controls */}
      <div className="table-controls">
        {showGlobalFilter && (
          <GlobalFilter 
            value={globalFilter} 
            onChange={setGlobalFilter} 
          />
        )}
        
        {showColumnControls && (
          <button
            onClick={() => setShowColumnVisibility(!showColumnVisibility)}
          >
            {showColumnVisibility ? "Hide Columns" : "Show Columns"}
          </button>
        )}
      </div>

      {/* Column Visibility Controls */}
      {showColumnControls && showColumnVisibility && (
        <ColumnControls 
          allColumns={allColumns} 
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <React.Fragment key={headerGroup.getHeaderGroupProps().key}>
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <div className="header-content">
                        {column.render("Header")}
                        {column.id !== "selection" && (
                          <span className="sort-indicator">
                            {column.isSorted
                              ? column.isSortedDesc ? " ▼" : " ▲"
                              : " ↕"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
                <tr className="filter-row">
                  {headerGroup.headers.map(column => (
                    <th key={column.id}>
                      {column.canFilter && column.render("Filter")}
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>Loading...</td>
              </tr>
            ) : page.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No data available</td>
              </tr>
            ) : (
              page.map(row => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={row.isSelected ? "selected" : ""}
                  >
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationControls
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        nextPage={nextPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        setPageSize={setPageSize}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
      />

      {/* Selected Rows Preview */}
      {showSelectedPreview && selectedRows.length > 0 && (
        <div className="selected-preview">
          <h3>Selected Rows ({selectedRows.length}):</h3>
          <pre>{JSON.stringify(selectedRows, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

ReUsableTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  initialState: PropTypes.object,
  onRowClick: PropTypes.func,
  showGlobalFilter: PropTypes.bool,
  showColumnControls: PropTypes.bool,
  showSelectedPreview: PropTypes.bool,
  pageSizeOptions: PropTypes.array,
  defaultPageSize: PropTypes.number,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ReUsableTable;