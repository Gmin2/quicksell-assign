import { useMemo } from 'react'
import './App.css'
import CustomersList from './CustomerList'
import { generateCustomers } from './lib/data'

function App() {
  const customers = useMemo(() => generateCustomers(1000), [])

  return (
    <div className="App">
      <CustomersList customers={customers} />
    </div>
  )
}

export default App
