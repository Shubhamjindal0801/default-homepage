import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../fireabse'
import { useNavigate } from 'react-router'

function Header() {
    const [user,loading] = useAuthState(auth)
    const navigate = useNavigate()
    useEffect(()=>{
        if(user){
            navigate('/landing')
        }
    },[user,loading])
  return (
    <div></div>
  )
}

export default Header