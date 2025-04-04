import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import List from './components/List'
import Card from './components/Card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <NavBar />

<div className="flex flex-row h-screen mt-[8vh] w-[100vw] overflow-hidden">
  <div className='overflow-hidden h-full'>
  <Sidebar />
  </div>
  <div className='flex-1 flex justify-center overflow-hidden'>
  <List  />
  </div>
</div>
 
  
    </>
  )
}

export default App
