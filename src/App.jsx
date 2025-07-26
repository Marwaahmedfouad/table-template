// import './App.css';
// import BasicTable from './components/BasicTable'
// import SortingTable from './components/SortingTable';
// import SortingTableFormatting from './components/SortingTableFormatting';
// import FilteringTable from './components/FilteringTable';
// import GlobalFilteringTablePagSelectedhidden from './components/GlobalFilteringTablePagSelectedhidden';
// import GlobalFilteringTablePagSelected from './components/GlobalFilteringTablePagSelected';
// import GlobalFilteringTablePag from './components/GlobalFilteringTablePag';
// import FilteringTablePagSelecteddoupleclick from './components/FilteringTablePagSelecteddoupleclick';
// import FilteringTablePagSelecteddoupleclickhidden from './components/FilteringTablePagSelecteddoupleclickhidden';
// import FilteringsortingTablePagSelecteddoupleclickhidden from './components/FilteringsortingTablePagSelecteddoupleclickhidden';
// import ReUsableTable from './components/ReUsableTable';


// function App() {








//   return (
//     <div style={{textAlign:'center'}}>
//         <BasicTable/>
//         <SortingTable/>
//         <FilteringTable/>
//         <SortingTableFormatting/>
//         <GlobalFilteringTablePag/>
//         <GlobalFilteringTablePagSelected/>
//         <FilteringTablePagSelecteddoupleclick/>
//         <GlobalFilteringTablePagSelectedhidden/>
//         <FilteringTablePagSelecteddoupleclickhidden/>
//         <FilteringsortingTablePagSelecteddoupleclickhidden/>



//    </div>
      
  
//   )
// }

// export default App

import React, { useMemo } from 'react';
import ReUsableTable from './components/ReUsableTable';
import DATA from "./data.json";
import BasicTable from './components/BasicTable'
import SortingTable from './components/SortingTable';
import SortingTableFormatting from './components/SortingTableFormatting';
import FilteringTable from './components/FilteringTable';
import GlobalFilteringTablePagSelectedhidden from './components/GlobalFilteringTablePagSelectedhidden';
import GlobalFilteringTablePagSelected from './components/GlobalFilteringTablePagSelected';
import GlobalFilteringTablePag from './components/GlobalFilteringTablePag';
import FilteringTablePagSelecteddoupleclick from './components/FilteringTablePagSelecteddoupleclick';
import FilteringTablePagSelecteddoupleclickhidden from './components/FilteringTablePagSelecteddoupleclickhidden';
import FilteringsortingTablePagSelecteddoupleclickhidden from './components/FilteringsortingTablePagSelecteddoupleclickhidden';
import './App.css';
import ReUsableUpdate from './components/ReUsableUpdate';

function App() {
  const columns = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Role',
      accessor: 'role',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`status ${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
  ], []);

  const handleRowClick = (row) => {
    console.log('Row clicked:', row.original);
  };

  return (
    <div className="app">
        <BasicTable/>
        <SortingTable/>
        <FilteringTable/>
        <SortingTableFormatting/>
        <GlobalFilteringTablePag/>
        <GlobalFilteringTablePagSelected/>
        <FilteringTablePagSelecteddoupleclick/>
        <GlobalFilteringTablePagSelectedhidden/>
        <FilteringTablePagSelecteddoupleclickhidden/>
        <FilteringsortingTablePagSelecteddoupleclickhidden/>
        
      <ReUsableTable
        columns={columns}
        data={DATA}
        title="User Management"
        onRowClick={handleRowClick}
        initialState={{
          hiddenColumns: ['id'],
          sortBy: [{ id: 'name', desc: false }]
        }}
        pageSizeOptions={[5, 10, 25]}
        defaultPageSize={10}
      />

   <ReUsableUpdate
        columns={columns}
        data={DATA}
        title="User Management"
        onRowClick={handleRowClick}
        initialState={{
          hiddenColumns: ['id'],
          sortBy: [{ id: 'name', desc: false }]
        }}
        pageSizeOptions={[5, 10, 25]}
        defaultPageSize={10}
      />
      
    </div>
  );
}

export default App;