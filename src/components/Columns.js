export default [
  {
    Header: 'ID',
    accessor: 'id',
    priority: 1, // Highest priority (always visible)
    minWidth: 60
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
    priority: 2,
    minWidth: 100
  },
  {
    Header: 'Last Name',
    accessor: 'lastName', 
    priority: 3,
    minWidth: 100
  },
  {
    Header: 'Status',
    accessor: 'status',
    priority: 4,
    minWidth: 80
  },
  {
    Header: 'Email',
    accessor: 'email',
    priority: 5,
    minWidth: 150
  },
  // Lower priority columns
  {
    Header: 'Department',
    accessor: 'department',
    priority: 6,
    minWidth: 120
  },
  {
    Header: 'Position',
    accessor: 'position',
    priority: 7,
    minWidth: 120
  },
  {
    Header: 'Date',
    accessor: 'date',
    priority: 8,
    minWidth: 100
  },
  {
    Header: 'Age', 
    accessor: 'age',
    priority: 9,
    minWidth: 80
  },
  {
    Header: 'Salary',
    accessor: 'salary',
    priority: 10,
    minWidth: 100
  },
  {
    Header: 'Start Date',
    accessor: 'startDate',
    priority: 11,
    minWidth: 100
  },
  {
    Header: 'Phone',
    accessor: 'phone',
    priority: 12,
    minWidth: 120
  },
  {
    Header: 'Address',
    accessor: 'address',
    priority: 13,
    minWidth: 150
  },
  {
    Header: 'City',
    accessor: 'city',
    priority: 14,
    minWidth: 100
  },
  {
    Header: 'Country',
    accessor: 'country',
    priority: 15, // Lowest priority (first to hide)
    minWidth: 100
  }
];