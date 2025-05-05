import Dashboard from '../views/Dashboard';
import Login from '../views/LoginAuth';
import Register from '../views/RegisterAuth';
import Header from '../components/Header';
import { Routes, Route, useLocation } from 'react-router'

function App() {
  const location = useLocation();

  // Define routes where the header should be hidden
  const hideHeaderRoutes = ['/login', '/register'];

  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
      <>
        {shouldShowHeader && <Header />}
        <div className='bg-(--night) flex justify-center h-[100px] min-h-[calc(100vh-94px)] lg:min-h-screen items-center grow rounded-lg shadow-md border-[1px] border-[#363839] relative'>
          <Routes>
              <Route path={'/login'} element={<Login />} />
              <Route path={'/dashboard'} element={<Dashboard />} />
              <Route path={'/register'} element={<Register />} />
          </Routes>
        </div>
      </>

  )
}

export default App
