import React from 'react'
import Chatuser from './Chatuser'
import Messages from './Messages'
import Type from './Type';
function Right() {
  return (
<>

    <div className='w-[70%]  bg-zinc-600 text-white'>
    <Chatuser></Chatuser>
    <Messages></Messages>
    <Type></Type>
    </div>
   </>
  );
}

export default Right