import { Box, FormField, TextInput, Button, Layer } from "grommet";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./app/store";
import { setUser } from "./features/acessControl/accessControl";
import AppRouter from "./Routes/AppRouter";
import { UserState } from "./features/acessControl/accessControl";


function App() {
  const user = useSelector((state: RootState) => state.accessControl);
  const [signup, setSignUp] = useState(false)
  const [userinfo, setUserInfo] = useState<UserState>({
    user_id : 0,
    role : "guest",
    enrollments:[],
    quiz_attempts: []
  });
  const [userid, setUserID] = useState(0);
  const dispatch = useDispatch();

  const authenticate = async (uid : number) => {
    if (uid <= 0) {
      alert("userid needs to be a positive integer");
      return;
    }
    await fetch(`http://127.0.0.1:8000/admin/user/getdets?userid=${uid}`)
    .then((res) => {
      if(!res.ok){
        throw new Error('User Not Registered')
      }
      return res.json()
    })
    .then((data)=>{
      setUserInfo({
        user_id : data.user_id,
        role : data.role,
        enrollments: data.enrollments,
        quiz_attempts: data.quiz_attempts,
      })
      localStorage.setItem('user', JSON.stringify({
        userid : data.user_id,
        role : data.role,
        enrollments: data.enrollments,
        quiz_attempts : data.quiz_attempts,
      }));

    })
    .catch((error)=>{
      alert(error)
    })
  };
  
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(stored){
      const storedUser = JSON.parse(stored);
       dispatch(
      setUser({
        user_id:  storedUser.userid,
        role:   storedUser.role,
        enrollments:storedUser.enrollments,
        quiz_attempts: storedUser.quiz_attempts
      })
    );
    }
    else{
      dispatch(
        setUser({
          user_id:  userinfo.user_id,
          role:   userinfo.role,
          enrollments:userinfo.enrollments,
          quiz_attempts: userinfo.quiz_attempts
        })
      );
    }
    
  }, [userinfo.user_id, userinfo.role, userinfo.enrollments,userinfo.quiz_attempts, dispatch]);


  useEffect(()=>{
    if(user.user_id>0){
      authenticate(user.user_id)
    }
  },[user.user_id])

  const [user_id, setUser_ID] = useState<number | null>(null)
    const [fname, setFname] = useState<string | null>(null)
    const [lname, setLname] = useState<string | null>(null)

    const CreateNewUser = () =>{
        if(user_id && fname && lname ){
            fetch(`http://127.0.0.1:8000/admin/user/create`, {
                method:"POST",
                headers:{
                    "Content-type": "application/json"
                },
                body:JSON.stringify({
                        user_id: user_id,
                        role: 2,
                        first_name: fname,
                        last_name: lname  
                })
            })
            .then((res) => res.json())
            .then((data)=>{
               
            })
            .catch((error)=>{
                console.error(error)
            })
        }
    }
  return (
    <Box fill="vertical">
      {user.user_id === 0? (
        <>
          <Box border width={"medium"} pad={"medium"} justify="center">
            LOGIN
            <FormField label="User ID">
              <TextInput
                onChange={(e) => {
                  setUserID(parseInt(e.target.value));
                }}
              />
            </FormField>
            <Button label="Login" onClick={()=>authenticate(userid)}></Button>
            <Button label="New User" onClick={()=> setSignUp(true)}/>

              {signup === true?
            <Layer onClickOutside={()=>setSignUp(false)}> 
              <Box border width={"medium"} pad={"medium"} justify="center">
            Sign Up
            <FormField label="User ID">
              <TextInput onChange={(e)=>setUser_ID(parseInt(e.target.value))}/>
            </FormField>
            <FormField label="First Name">
              <TextInput onChange={(e)=>setFname(e.target.value)}/>
            </FormField>
            <FormField label="Last Name">
              <TextInput onChange={(e)=>setLname(e.target.value)}/>
            </FormField>
            <Button label="Create Account" onClick={()=>CreateNewUser()} ></Button>
          </Box>
              </Layer>
            :  
            <></>
            }
          </Box>
            
        </>
      ) : (
        <>
          <AppRouter />
        </>
      )}
    </Box>
  );
}

export default App;