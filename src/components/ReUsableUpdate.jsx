import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useColumnOrder,
} from "react-table";
// import "./table.css";
// import {  useSelector } from "react-redux";
// import { closePopup, openPopup } from "../../application/slices/uiSlice";
// import Popup from "../../globalComponents/Popup";
// import DisplaySelectedItems from "./DisplaySelectedItems";

/**
 * Default column filter component that renders a search input for column filtering
 * @param {Object} props - Component props
 * @param {Object} props.column - Column object from react-table
 * @param {any} props.column.filterValue - Current filter value
 * @param {Function} props.column.setFilter - Function to set filter value
 */
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder="Search..."
    className="filter-input"
  />
);

DefaultColumnFilter.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.any,
    setFilter: PropTypes.func,
  }),
};

/**
 * Global filter component for searching across all table data
 * @param {Object} props - Component props
 * @param {string} props.value - Current filter value
 * @param {Function} props.onChange - Handler for filter changes
 */
const GlobalFilter = ({ value, onChange }) => (
  <span className="global-filter-container">
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type to search"
      className="global-filter-input"
    />
  </span>
);

GlobalFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

/**
 * Custom checkbox component that supports indeterminate state
 */
const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});
Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  indeterminate: PropTypes.bool,
};

/**
 * Checkbox for table header to select/deselect all rows
 * @param {Object} props - Component props
 * @param {Object} props.getToggleAllRowsSelectedProps - Props from react-table for select all functionality
 */
const HeaderCheckbox = ({ getToggleAllRowsSelectedProps }) => (
  <div>
    <Checkbox {...getToggleAllRowsSelectedProps()} />
  </div>
);

HeaderCheckbox.propTypes = {
  getToggleAllRowsSelectedProps: PropTypes.func,
};

/**
 * Checkbox for individual table rows
 * @param {Object} props - Component props
 * @param {Object} props.row - Row object from react-table
 */
const RowCheckbox = ({ row }) => (
  <div>
    <Checkbox {...row.getToggleRowSelectedProps()} />
  </div>
);

RowCheckbox.propTypes = {
  row: PropTypes.shape({
    getToggleRowSelectedProps: PropTypes.func,
  }),
};

/**
 * Component for controlling column visibility and pinning
 * @param {Object} props - Component props
 * @param {Array} props.allColumns - Array of all available columns
 * @param {Array} props.columnData - Current column configuration state
 * @param {Function} props.setColumnData - Function to update column configuration
 */
const ColumnControls = ({ allColumns, columnData, setColumnData }) => {
  // Filter out the selection column from controls
  const nonSelectionColumns = allColumns.filter(
    (col) => col.id !== "selection"
  );

  // Check if all non-selection columns are hidden
  const allHidden = nonSelectionColumns.every(
    (col) => columnData.find((c) => c.id === col.id)?.isVisible === false
  );

  // Check if some (but not all) columns are hidden
  const someHidden = nonSelectionColumns.some(
    (col) => columnData.find((c) => c.id === col.id)?.isVisible === false
  );

  /**
   * Toggles the visibility of a single column
   * @param {string} columnId - ID of the column to toggle
   */
  const toggleColumn = (columnId) => {
    setColumnData((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
      )
    );
  };

  /**
   * Toggles the pinned state of a column
   * @param {string} columnId - ID of the column to pin/unpin
   */
  const togglePinColumn = (columnId) => {
    setColumnData((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, pinned: !col.pinned } : col
      )
    );
  };

  return (
    <div className="column-controls-container">
      <div className="column-controls-header">
        {/* Show "Show All" button only if some or all columns are hidden */}
        {(someHidden || allHidden) && (
          <button
            className="toggle-all-btn"
            onClick={() => {
              // Show all columns (including selection column)
              allColumns.forEach((col) => {
                col.toggleHidden(false);
              });

              // Update column data state
              setColumnData((prev) =>
                prev.map((col) => ({
                  ...col,
                  isVisible: true,
                }))
              );
            }}
            title="Show all columns"
          >
            Show All
          </button>
        )}
      </div>

      {/* List of columns with visibility toggles and pin buttons */}
      <div className="columns-list flex">
        {nonSelectionColumns.map((column) => {
          const columnConfig = columnData.find((c) => c.id === column.id);
          const isVisible = columnConfig?.isVisible !== false;
          const isPinned = columnConfig?.pinned === true;

          return (
            <div
              key={column.id}
              className={`column-item ${isPinned ? "pinned" : ""}`}
            >
              <div className="column-info">
                <label className="visibility-toggle">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleColumn(column.id)}
                  />
                  <span className="column-name">{column.Header}</span>
                </label>
              </div>
              <div className="column-actions">
                <button
                  className={`pin-btn ${isPinned ? "active" : ""}`}
                  onClick={() => togglePinColumn(column.id)}
                  title={isPinned ? "Unpin column" : "Pin column"}
                >
                  <i className={`icon-pin ${isPinned ? "active" : ""}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ColumnControls.propTypes = {
  allColumns: PropTypes.array,
  columnData: PropTypes.array,
  setColumnData: PropTypes.func,
};

/**
 * Pagination controls component
 * @param {Object} props - Component props
 * @param {Function} props.gotoPage - Function to go to specific page
 * @param {boolean} props.canPreviousPage - Whether previous page is available
 * @param {Function} props.previousPage - Function to go to previous page
 * @param {Function} props.nextPage - Function to go to next page
 * @param {boolean} props.canNextPage - Whether next page is available
 * @param {number} props.pageCount - Total number of pages
 * @param {number} props.pageIndex - Current page index
 * @param {Array} props.pageOptions - Array of available page options
 * @param {Function} props.setPageSize - Function to set page size
 * @param {number} props.pageSize - Current page size
 * @param {Array} props.pageSizeOptions - Available page size options
 */
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
  <div className="pagination-container">
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
    <span className="page-indicator">
      Page
      <strong>
        {pageIndex + 1} of {pageOptions.length}
      </strong>
    </span>
    <input
      type="number"
      defaultValue={pageIndex + 1}
      onChange={(e) => {
        const page = e.target.value ? Number(e.target.value) - 1 : 0;
        gotoPage(page);
      }}
      style={{ width: "100px" }}
    />
    <select
      className="page-size-select"
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>
  </div>
);

PaginationControls.propTypes = {
  gotoPage: PropTypes.func,
  canPreviousPage: PropTypes.bool,
  previousPage: PropTypes.func,
  nextPage: PropTypes.func,
  canNextPage: PropTypes.bool,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.array,
  setPageSize: PropTypes.func,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.array,
};

/**
 * Draggable table header component with sorting and pinning support
 * @param {Object} props - Component props
 * @param {Object} props.column - Column object from react-table
 * @param {number} props.index - Column index
 * @param {Function} props.moveColumn - Function to handle column reordering
 */
const DraggableHeader = ({ column, moveColumn }) => {
  /**
   * Handles drag start event for column reordering
   * @param {Event} e - Drag event
   */
  const handleDragStart = (e) => {
    if (column.pinned) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", column.id);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.4";
  };

  /**
   * Handles drag end event
   * @param {Event} e - Drag event
   */
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.classList.remove("drag-over");
  };

  /**
   * Handles drag over event
   * @param {Event} e - Drag event
   */
  const handleDragOver = (e) => {
    if (column.pinned) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("drag-over");
  };

  /**
   * Handles drag leave event
   * @param {Event} e - Drag event
   */
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  /**
   * Handles drop event for column reordering
   * @param {Event} e - Drag event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    const draggedColumnId = e.dataTransfer.getData("text/plain");
    if (draggedColumnId !== column.id) {
      moveColumn(draggedColumnId, column.id);
    }
  };

  const {  ...headerProps } = column.getHeaderProps(
    column.getSortByToggleProps()
  );

  return (
    <th
      key={column.id}
      {...headerProps}
      draggable={column.id !== "selection" && !column.pinned}
      onDragStart={column.id !== "selection" ? handleDragStart : undefined}
      onDragEnd={column.id !== "selection" ? handleDragEnd : undefined}
      onDragOver={column.id !== "selection" ? handleDragOver : undefined}
      onDragLeave={column.id !== "selection" ? handleDragLeave : undefined}
      onDrop={column.id !== "selection" ? handleDrop : undefined}
      className={`${headerProps.className || ""} ${
        column.id !== "selection" ? "draggable-header" : ""
      } ${column.pinned ? "pinned-column" : ""}`}
      style={{
        ...headerProps.style,
        cursor:
          column.id !== "selection" && !column.pinned ? "grab" : "default",
      }}
    >
      <div className="header-content">
        {column.id !== "selection" && !column.pinned && (
          <span className="drag-handle">⋮⋮</span>
        )}
        {column.pinned && <span className="pin-icon">📌</span>}
        {column.render("Header")}
        {column.id !== "selection" && (
          <span className="sort-indicator">
            {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : " ↕"}
          </span>
        )}
      </div>
    </th>
  );
};

DraggableHeader.propTypes = {
  column: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  moveColumn: PropTypes.func.isRequired,
};

/**
 * Main reusable table component with sorting, filtering, pagination, and column controls
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column definitions
 * @param {Array} props.data - Table data
 * @param {string} [props.title="Data Table"] - Table title
 * @param {Object} [props.initialState={}] - Initial table state
 * @param {Function} [props.onRowClick] - Handler for row clicks
 * @param {boolean} [props.showGlobalFilter=true] - Whether to show global filter
 * @param {boolean} [props.showColumnControls=true] - Whether to show column controls
 * @param {boolean} [props.showSelectedPreview=true] - Whether to show selected rows preview
 * @param {Array} [props.pageSizeOptions=[5, 10, 20, 30, 50]] - Available page size options
 * @param {number} [props.defaultPageSize=10] - Default page size
 * @param {string} [props.className=""] - Additional className for the table container
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {Function} [props.onColumnOrderChange] - Callback for column order changes
 */
const ReUsableUpdate = ({
  columns: userColumns,
  data,
  title = "Data Table",
  initialState = {},
  onRowClick,
  showGlobalFilter = true,
  showColumnControls = true,
//   showSelectedPreview = true,
  pageSizeOptions = [5, 10, 20, 30, 50],
  defaultPageSize = 10,
  className = "",
  isLoading = false,
  onColumnOrderChange,
}) => {
  // Process user columns to ensure they have required properties
  const processedUserColumns = useMemo(() => {
    return userColumns.map((col, idx) => ({
      ...col,
      id: col.id || col.accessor || `col_${idx}`,
      accessor: col.accessor || String(col.id).toLowerCase(),
      canSort: col.canSort !== false,
    }));
  }, [userColumns]);

  // Popup
//   const { tablePopUp } = useSelector((state) => state.ui);
  // console.log(isOpen);

//   const dispatch = useDispatch();

  // Add selection column to the processed columns
  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: HeaderCheckbox,
        Cell: RowCheckbox,
        disableSortBy: true,
        width: 50,
      },
      ...processedUserColumns,
    ],
    [processedUserColumns]
  );

  // Initialize column data state with default values
  const initialColumnData = useMemo(() => {
    return columns.map((col, index) => ({
      id: col.id,
      order: index,
      isVisible: true,
      pinned: false,
      width: col.width,
      Header: col.Header,
      accessor: col.accessor,
      canSort: col.canSort,
    }));
  }, [columns]);

  const [columnData, setColumnData] = useState(initialColumnData);

  // Determine which columns should be hidden based on columnData
  const hiddenColumns = useMemo(() => {
    const nonSelectionCols = columnData.filter((col) => col.id !== "selection");
    const allHidden = nonSelectionCols.every((col) => col.isVisible === false);

    return columnData
      .filter((col) => {
        if (allHidden) return true; // hide everything including selection
        return col.isVisible === false;
      })
      .map((col) => col.id);
  }, [columnData]);

  // Determine column order with pinned columns first
  const columnOrder = useMemo(() => {
    const ordered = [...columnData]
      .filter((col) => col.id !== "selection")
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return a.order - b.order;
      })
      .map((col) => col.id);
    return ["selection", ...ordered];
  }, [columnData]);

  // Initialize react-table with all plugins
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
    setColumnOrder,
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
        hiddenColumns: hiddenColumns,
        columnOrder: columnOrder,
        ...initialState,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useColumnOrder,
    usePagination,
    useRowSelect
  );

  // Sync pinned property from columnData to react-table columns
  useEffect(() => {
    allColumns.forEach((column) => {
      const columnConfig = columnData.find((c) => c.id === column.id);
      if (columnConfig) {
        column.pinned = columnConfig.pinned;
      }
    });
  }, [allColumns, columnData]);

  // Sync column order changes to react-table
  useEffect(() => {
    setColumnOrder(columnOrder);
  }, [columnOrder, setColumnOrder]);

  // Get selected rows data
  const selectedRows = useMemo(
    () => selectedFlatRows.map((row) => row.original),
    [selectedFlatRows]
  );

  // Sync column visibility changes to react-table
  useEffect(() => {
    allColumns.forEach((column) => {
      if (column.id !== "selection") {
        const columnConfig = columnData.find((c) => c.id === column.id);
        const shouldBeVisible = columnConfig?.isVisible !== false;

        if (column.isVisible !== shouldBeVisible) {
          column.toggleHidden(!shouldBeVisible);
        }
      }
    });
  }, [columnData, allColumns]);

  /**
   * Handles column reordering
   * @param {string} draggedColumnId - ID of the column being dragged
   * @param {string} targetColumnId - ID of the column being dropped on
   */
  const moveColumn = (draggedColumnId, targetColumnId) => {
    setColumnData((prev) => {
      // Don't move pinned columns
      const draggedColumn = prev.find((col) => col.id === draggedColumnId);
      if (draggedColumn?.pinned) return prev;

      // Don't allow dropping before pinned columns
      const targetColumn = prev.find((col) => col.id === targetColumnId);
      if (targetColumn?.pinned) return prev;

      const draggedIndex = prev.findIndex((col) => col.id === draggedColumnId);
      const targetIndex = prev.findIndex((col) => col.id === targetColumnId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      // Perform the column move
      const newColumnData = [...prev];
      const [draggedColumnData] = newColumnData.splice(draggedIndex, 1);
      newColumnData.splice(targetIndex, 0, draggedColumnData);

      // Update order for non-pinned columns only
      let orderCounter = 0;
      const updatedData = newColumnData.map((col) => {
        if (col.pinned) return col;
        return {
          ...col,
          order: orderCounter++,
        };
      });

      // Filter out selection column and call onChange callback if provided
      const filteredData = updatedData.filter((col) => col.id !== "selection");
      if (onColumnOrderChange) {
        onColumnOrderChange(filteredData, {
          draggedColumnId,
          targetColumnId,
          fromIndex: draggedIndex,
          toIndex: targetIndex,
        });
      }

      return updatedData;
    });
  };

//   const handleTablePopup = () => {
//     // dispatch(openPopup("table"));
//   };
  return (
    <div className={`modern-table-container ${className}`}>
      {/* Table header with title and global filter */}
      <div className="table-header flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="table-title text-xl font-bold text-white">{title}</h2>

        <div className="table-controls flex items-center gap-4">
          {selectedRows.length > 0 && (
            <button
              type="button"
            //   onClick={handleTablePopup}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 font-semibold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
              title="View selected users"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Show Selected ({selectedRows.length})
            </button>
          )}
          {showGlobalFilter && (
            <GlobalFilter value={globalFilter} onChange={setGlobalFilter} />
          )}
        </div>
      </div>

      {/* Column visibility and pinning controls */}
      {showColumnControls && (
        <ColumnControls
          allColumns={allColumns}
          columnData={columnData}
          setColumnData={setColumnData}
        />
      )}

      {/* Main table element */}
      <div className="table-wrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...headerGroupProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <React.Fragment key={key}>
                  {/* Column headers row */}
                  <tr key={`header-${key}`} {...headerGroupProps}>
                    {headerGroup.headers.map((column, index) => (
                      <DraggableHeader
                        key={column.id}
                        column={column}
                        index={index}
                        moveColumn={moveColumn}
                      />
                    ))}
                  </tr>
                  {/* Column filters row */}
                  <tr key={`filter-${key}`} className="filter-row">
                    {headerGroup.headers.map((column) => (
                      <th key={`${column.id}-filter`}>
                        {column.canFilter && column.render("Filter")}
                      </th>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {/* Loading state */}
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="loading-state">
                  <div className="loading-spinner" /> Loading...
                </td>
              </tr>
            ) : /* Empty state */
            page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No data available</p>
                  <small>Try adjusting filters or searching again.</small>
                </td>
              </tr>
            ) : (
              /* Data rows */
              page.map((row) => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();
                return (
                  <tr
                    key={key}
                    {...rowProps}
                    onClick={() => {
                      row.toggleRowSelected();
                      if (onRowClick) onRowClick(row);
                    }}
                    className={`cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                      row.isSelected ? "bg-blue-100" : ""
                    }`}
                  >
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps();
                      return (
                        <td key={cellKey} {...cellProps}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
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

      {/* Selected rows preview section */}

      {/* {showSelectedPreview && selectedRows.length > 0 && (
        <Popup
        //   isOpen={tablePopUp}
        //   setIsOpen={() => dispatch(closePopup("table"))}
          component={<DisplaySelectedItems selectedRows={selectedRows} />}
        />
      )} */}
    </div>
  );
};

ReUsableUpdate.propTypes = {
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
  onColumnOrderChange: PropTypes.func,
};

export default ReUsableUpdate;
