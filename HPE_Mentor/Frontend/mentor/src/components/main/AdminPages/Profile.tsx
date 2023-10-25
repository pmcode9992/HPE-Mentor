import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import accessControl from '../../../features/acessControl/accessControl'

function Profile() {

  const user = useSelector((state:RootState) => state.accessControl)
  return (
    <div>
      User ID : {user.user_id} <br />
      Role: {user.role}
    </div>
  )
}

export default Profile