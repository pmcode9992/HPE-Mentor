import React, { useEffect, useState } from 'react'
import { DataTable, Meter, Box } from 'grommet'
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
interface Enrollements{
  enrollment_id : number;
  user_id : number;
  tecnhology_id : number;
  enrollment_date : Date;
  progress : number;
  grade: string;
  technology_name : string;
}
function EnrolledCourses() {
  const user = useSelector((state: RootState) => state.accessControl);

  const [enrollments , setEnrollments] = useState<Enrollements[]>([])
  function getCourses(){
    fetch(`http://127.0.0.1:8000/adminuser/mycourses?uid=${user.user_id}`)
    .then((res) => res.json())
    .then((json)=>{
      setEnrollments(Object.values(json))
    })
  }

  useEffect(()=>{
    getCourses()
  },[])

  useEffect(()=>{
    console.log(enrollments)
  },[enrollments])

  return (
    <Box pad={"medium"} >
    <Box border>
    <DataTable
    columns={[
      {header: "Enrollment ID", primary: true, property: "enrollment_id"},
      {header: "Course ID", property: "technology_id"},
      {property: "technology_name", header: "Course Name"},
      {property: "enrollment_date", header: "Start Date"}
    ]}
     data={enrollments} step={50} />
     </Box>
     </Box>
  )
}

export default EnrolledCourses