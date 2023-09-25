import React from 'react'
import './InputComponent.css'


function InputComponent({label,state,setState,placeholder,type}) {
    return (
        <div className='input-container'>
            <p className='label-input'>{label}<span style={{ color: '#DD4A3D' }}>*</span></p>
            <input
            required
            value={state}
            type={type}
            placeholder={placeholder}
            onChange={(e)=>setState(e.target.value)} className='custom-input'
            />
        </div>
    )
}

export default InputComponent
