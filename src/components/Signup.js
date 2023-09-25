import React, { useState } from "react";
import "./Signup.css";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "../fireabse";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import InputComponent from './InputComponenet'
import Button from './Button'
import { toast } from 'react-toastify'

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function signupWithEmail(){
    if (name.length != '' && email.length != '' && pass.length != '' && conPass.length != ''){
      if(pass===conPass){
        createUserWithEmailAndPassword(auth,email,pass)
          .then((userCrenditial)=>{
            const user = userCrenditial.user
            toast.success('Account created successfully')
            setLoading(false)
            setConPass('')
            setEmail('')
            setName('')
            setPass('')
            createDoc(user)
            navigate("/landing")
          })
          .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false)
          })
    }else{
      toast.error(`Password doesn't match`)
      setLoading(false)
    }
  }else{
    toast.error('All field are mandatory')
    setLoading(false)
  }
}

function loginWithEmail(){
  if (email != '' && pass != ''){
    signInWithEmailAndPassword(auth,email,pass)
    .then((userCrenditial)=>{
        const user = userCrenditial.user
        toast.success('Successfully logged in')
        setLoading(false)
        navigate("/landing")
      })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage)
        setLoading(false)
      })
  }else{
    toast.error('All field are mandatory')
    setLoading(false)
  }
}

async function createDoc(user){
  setLoading(true)
  if(!user)return;

  const userRef = doc(db, "users", user.uid)
  const userData = await getDoc(userRef)

  if(!userData.exists()){
    try {
      await setDoc(doc(db, "users", user.uid),{
        name: user.displayName ? user.displayName : name,
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
      })
      toast.success('Doc created')
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }else{
    setLoading(false)
  }
}

function googleAuth(){
  setLoading(true)
  try{
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("User>>>",user)
        createDoc(user)
        navigate("/landing")
        toast.success('User Authenticated successfully')
        setLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage)
        setLoading(false)
      })
  }catch(e){
    toast.error(e.message)
    setLoading(false)
  }
}

return (
  <div className="main-body">
      {login ? <>
          <div className="signup-container">
              <h2 className="title">Login</h2>
              <form>

                  <InputComponent
                      placeholder={'johndoe@gmail.com'}
                      label={'Email'}
                      state={email}
                      type={'email'}
                      setState={setEmail}
                  />
                  <InputComponent
                      placeholder={'Example123'}
                      label={'Password'}
                      state={pass}
                      type={'password'}
                      setState={setPass}
                  />
                  <Button
                      disabled={loading}
                      text={loading ? 'Loading...' : 'Log in With Email and Password'}
                      blue={false}
                      onClick={loginWithEmail}
                  />

                  <p style={{ textAlign: 'center', fontSize: '0.8rem', margin: 0 }}>or</p>
                  <Button
                      onClick={googleAuth}
                      text={loading ? 'Loading...' : 'Log in With Google'}
                      blue={true}
                  />
                  <p onClick={() => setLogin(!login)} style={{ textAlign: 'center', fontSize: '0.8rem', margin: 0, cursor: 'pointer' }}>Or Don't Have An Account? Click Here</p>
              </form>
          </div>
      </>
          :
          <div className="signup-container">
              <h2 className="title">Sign Up</h2>
              <form>
                  <InputComponent
                      placeholder={'John Doe'}
                      label={'Full Name'}
                      state={name}
                      type={'text'}
                      setState={setName}
                  />
                  <InputComponent
                      placeholder={'johndoe@gmail.com'}
                      label={'Email'}
                      state={email}
                      type={'email'}
                      setState={setEmail}
                  />
                  <InputComponent
                      placeholder={'Example123'}
                      label={'Password'}
                      state={pass}
                      type={'password'}
                      setState={setPass}
                  />
                  <InputComponent
                      placeholder={'Example123'}
                      label={'Confirm Password'}
                      state={conPass}
                      type={'password'}
                      setState={setConPass}
                  />

                  <Button
                      disabled={loading}
                      text={loading ? 'Loading...' : 'Sign Up With Email and Password'}
                      blue={false}
                      onClick={signupWithEmail}
                  />

                  <p style={{ textAlign: 'center', fontSize: '0.8rem', margin: 0 }}>or</p>
                  <Button
                      onClick={googleAuth}
                      text={loading ? 'Loading...' : 'Sign Up With Google'}
                      blue={true}
                  />
                  <p onClick={() => setLogin(!login)} style={{ textAlign: 'center', fontSize: '0.8rem', margin: 0, cursor: 'pointer' }}>Or Have An Account Already? Click Here</p>
              </form>
          </div>}

  </div>
)
}

export default Signup;
