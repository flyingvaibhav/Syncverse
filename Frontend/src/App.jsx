import React from 'react'
import Left from './home/left/left'
import Right from './home/left/right/Right'
import Logout from './home/left/left1/Logout'

function App() {
  return (
    <>
    <div className='flex h-screen'>
      <Logout></Logout>
    <Left></Left>
    <Right></Right>
    
    </div>
    </>
  )
}

export default App