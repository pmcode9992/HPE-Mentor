import { Box, FormField, TextInput, Button } from 'grommet';
import React, { useState } from 'react'
import { redirectDocument, useHref } from 'react-router-dom';

function NewUser() {
    const [userid, setUserID] = useState<number | null>(null)
    const [fname, setFname] = useState<string | null>(null)
    const [lname, setLname] = useState<string | null>(null)

    const CreateNewUser = () =>{
        if(userid && fname && lname ){
            fetch(`http://127.0.0.1:8000/admin/user/create`, {
                method:"POST",
                headers:{
                    "Content-type": "application/json"
                },
                body:JSON.stringify({
                        user_id: userid,
                        role: 2,
                        first_name: fname,
                        last_name: lname  
                })
            })
            .then((res) => res.json())
            .then((data)=>{
               redirectDocument('/')
            })
            .catch((error)=>{
                console.error(error)
            })
        }
    }

  return (
    <Box border width={"medium"} pad={"medium"} justify="center">
            Sign Up
            <FormField label="User ID">
              <TextInput onChange={(e)=>setUserID(parseInt(e.target.value))}/>
            </FormField>
            <FormField label="First Name">
              <TextInput onChange={(e)=>setFname(e.target.value)}/>
            </FormField>
            <FormField label="Last Name">
              <TextInput onChange={(e)=>setLname(e.target.value)}/>
            </FormField>
            <Button label="Create Account" onClick={()=>CreateNewUser()} ></Button>
          </Box>
  )
}

export default NewUser