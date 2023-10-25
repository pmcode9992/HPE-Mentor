import { Box, Button, Text } from 'grommet'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

function UserProfile() {
  const user = useSelector((state: RootState) => state.accessControl);
  const HandleLogout = () =>{
    localStorage.removeItem("user")
  }
  return (
    <>
    <Box pad={"medium"}>
    <Box align='end' justify='end' pad={"medium"}>
    <Button label="Logout" onClick={HandleLogout}  href='/' primary/>

    </Box>
    <Box align='start' justify='start'>
      <Text size='large'> User ID : {user.user_id}</Text>
      <Text size='large'> User Role : {user.role}</Text>
      <Text size='large'> Enrolled Courses : {user.enrollments}</Text>
      <Text size='large'> Attempted Quizzes : {user.quiz_attempts}</Text>

    </Box>
    </Box>
    </>
  )
}

export default UserProfile