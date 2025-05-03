import Dashboard from '../views/Dashboard';
import Authorization from '../views/Authorization';
import Header from '../components/Header';
import { Routes, Route } from 'react-router'

function App() {

  return (
      <>
        <Header />
        <div className='bg-(--night) flex justify-center h-[100px] min-h-[calc(100vh-94px)] lg:min-h-screen items-center grow rounded-lg shadow-md border-[1px] border-[#363839] relative'>
          <Routes>
              <Route path={'/login'} element={<Authorization />} />
              <Route path={'/dashboard'} element={<Dashboard />} />
          </Routes>
        </div>
      </>

  )
}

export default App
