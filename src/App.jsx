import './App.css';
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
import FilteringsortingTablePagSelecteddoupleclickhiddeneachcolumn from './components/FilteringsortingTablePagSelecteddoupleclickhiddeneachcolumn';

function App() {

  return (
    <div style={{textAlign:'center'}}>
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
    </div>
      
  
  )
}

export default App

