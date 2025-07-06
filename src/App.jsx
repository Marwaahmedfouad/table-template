import './App.css';
import BasicTable from './components/BasicTable'
import SortingTable from './components/SortingTable';
import SortingTableFormatting from './components/SortingTableFormatting';
import FilteringTable from './components/FilteringTable';
import GlobalFilteringTablePagSelectedhidden from './components/GlobalFilteringTablePagSelectedhidden';
import GlobalFilteringTablePagSelected from './components/GlobalFilteringTablePagSelected';
import GlobalFilteringTablePag from './components/GlobalFilteringTablePag';
import FilteringTablePagSelecteddoupleclick from './components/FilteringTablePagSelecteddoupleclick';

function App() {

  return (
    <div style={{textAlign:'center'}}>
        <BasicTable/>
        <SortingTable/>
        <SortingTableFormatting/>
        <FilteringTable/>
        <GlobalFilteringTablePagSelectedhidden/>
        <GlobalFilteringTablePagSelected/>
        <GlobalFilteringTablePag/>
        <FilteringTablePagSelecteddoupleclick/>
    </div>
      
  
  )
}

export default App

