import React from 'react'
import Search from './Search'
import User from './User';

function Left() {
  return (
    < div className=' w-[30%]  bg-black text-white' >
    
    <h1 className='font-bold text-3xl p-2 px-11'>Chats</h1>
     <Search></Search>
     <hr></hr>
     <User></User>
    
    </div>

   
  );
}

export default Left;