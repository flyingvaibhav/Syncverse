import React from 'react'
import { IoMdSend } from "react-icons/io";


function Type() {
  return (
    <div>
        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
<button className='button button-primary'>
    <IoMdSend/>
</button>

    </div>
  )
}

export default Type