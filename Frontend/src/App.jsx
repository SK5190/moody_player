import React, { useState } from 'react'
import FacialExpression from './components/FacialExpression'
import Navbar from './NavBar/Navbar'
import RecommendedTracks from './RecommendedTracks/RecommendedTracks'

const App = () => {
  const [Songs, setSongs] = useState([])
  return (
    <div className='bg-gray-100 min-h-screen'>
    <Navbar />
    <hr className='text-gray-200' />
      <FacialExpression setSongs={setSongs} />
      <RecommendedTracks Songs={Songs} />
    </div>
  )
}

export default App