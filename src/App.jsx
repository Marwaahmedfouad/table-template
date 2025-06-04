import './App.css';
import BasicTable from './components/BasicTable'
import BasicTable from './components/BasicTable'
import SortingTable from './components/SortingTable';
import SortingTableFormatting from './components/SortingTableFormatting';
import FilteringTable from './components/FilteringTable';
function App() {

  return (
    <div style={{textAlign:'center'}}>
        <BasicTable/>
        <BasicTable/>
        <SortingTable/>
        <SortingTableFormatting/>
        <FilteringTable/>
    </div>
      
  
  )
}

export default App

