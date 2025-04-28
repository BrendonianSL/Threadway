import Dashboard from '../views/Dashboard';
import Authorization from '../views/Authorization';
import Header from '../components/Header';
import { Routes, Route } from 'react-router'

function App() {

  return (
    <Routes>
      <Route path={'/login'} element={<Authorization />} />
      <Route path={'/dashboard'} element={<Dashboard />} />
    </Routes>
  )
}

export default App
