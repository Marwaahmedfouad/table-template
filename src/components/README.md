# Advanced Data Table Component

A highly customizable React table component built with react-table that supports filtering, sorting, pagination, row selection, column visibility, and more.

## Features

- Global and column-specific filtering
- Column sorting
- Pagination with customizable page sizes
- Row selection with checkboxes
- Column visibility toggle
- Double-click row handling
- Selected rows data preview
- Responsive design

## Usage

```jsx
import FilteringsortingTablePagSelecteddoupleclickhidden from './components/FilteringsortingTablePagSelecteddoupleclickhidden';

// Basic usage with default configuration
<FilteringsortingTablePagSelecteddoupleclickhidden />

// Custom configuration
<FilteringsortingTablePagSelecteddoupleclickhidden
  tableData={yourData}
  tableColumns={yourColumns}
  initialPageSize={10}
  pageSizeOptions={[5, 10, 20, 30, 50]}
  onRowDoubleClick={(rowData) => console.log(rowData)}
  initialHiddenColumns={['email', 'phone']}
  showGlobalFilter={true}
  showColumnVisibility={true}
  showPagination={true}
  showSelectedData={true}
  className="custom-table"
  title="My Custom Table"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tableData` | Array | `null` | Array of objects containing the table data. If not provided, uses default data. |
| `tableColumns` | Array | `null` | Array of column definitions. If not provided, uses default columns. |
| `initialPageSize` | Number | `10` | Initial number of rows per page. |
| `pageSizeOptions` | Array | `[5, 10, 20, 30, 50]` | Available options for rows per page. |
| `onRowDoubleClick` | Function | `null` | Callback function triggered when a row is double-clicked. Receives the row data as parameter. |
| `initialHiddenColumns` | Array | `[]` | Array of column IDs to hide initially. |
| `showGlobalFilter` | Boolean | `true` | Whether to show the global search filter. |
| `showColumnVisibility` | Boolean | `true` | Whether to show the column visibility toggle. |
| `showPagination` | Boolean | `true` | Whether to show the pagination controls. |
| `showSelectedData` | Boolean | `true` | Whether to show the selected rows data preview. |
| `className` | String | `''` | Additional CSS class name for the table container. |
| `title` | String | `'Advanced Data Table'` | Table title displayed at the top. |

## Column Definition

```javascript
{
  Header: 'Column Name',    // Display name of the column
  accessor: 'fieldName',    // Field name in the data object
  priority: 1,             // Priority for responsive visibility (optional)
  minWidth: 100,           // Minimum width of the column (optional)
  // Additional react-table column options can be added
}
```

## Styling

The component uses CSS classes for styling. You can override these classes in your stylesheet:

- `.table-container` - Main container
- `.table-title` - Table title
- `.table-controls` - Controls container
- `.global-filter` - Global search filter
- `.column-visibility-toggle` - Column visibility button
- `.column-visibility-controls` - Column visibility panel
- `.data-table` - Table element
- `.header-row` - Table header row
- `.data-row` - Table data row
- `.selected-row` - Selected row style
- `.pagination-controls` - Pagination controls container