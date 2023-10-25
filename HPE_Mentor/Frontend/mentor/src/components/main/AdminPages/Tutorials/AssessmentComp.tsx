import {
  Card,
  CardBody,
  FormField,
  TextInput,
  Button,
  CardFooter,
  Text,
  Box,
  CardHeader,
  Grid,
} from "grommet";
import { Trash } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../app/store";

interface Assessments {
  technology_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_active: string;
  is_deleted: string;
  assessment_id: number;
  assessment_name: string;
  created_by: number;
}

function AssessmentComp() {
  const { techid } = useParams();
  const [assessment_id, setAssessmentID] = useState(0);
  const [assessment_name, setAssessmentName] = useState("");
  const [assessment, setAssessment] = useState<Assessments[]>([]);
  const user = useSelector((state: RootState) => state.accessControl);
  const [getAsessments, setgetAssessments] = useState(false);

  const AddAssessments = () => {
    console.log(assessment_id, assessment_name, techid)
    fetch("http://127.0.0.1:8000/admin/createtest", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tech_id: techid,
        assessment_id: assessment_id,
        assessment_name: assessment_name,
        creator: user.user_id
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          // Handle the 422 error here
          alert("Unprocessable Entity: Request data is invalid.");
        } else if (res.status === 200) {
          return res.json();
        } else if (res.status === 500) {
          // Handle other status codes here
          alert("Quiz ID Already Exists");
        } else {
          alert("Unknown Error");
        }
      })
      .then((data) => {
        console.log(data);
        setgetAssessments(getAsessments === true ? false : true);
      });
  };
  const Delete_Assessment = (assessment_id: number) => {
    console.log(assessment_id);
    fetch(`http://127.0.0.1:8000/admin/delete/assessment`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        assessment_id: assessment_id,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          alert("Unprocessable Entity: Request data is invalid.");
        } else if (res.status === 200) {
          return res.json();
        } else if (res.status === 500) {
          alert("Database Error");
        } else {
          alert("Unknown Error");
        }
      })
      .then((data) => {
        setgetAssessments(getAsessments === true ? false : true);
      });
  };

  // Get Assessments
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/admin/getproblems?techid=${techid}`)
      .then((res) => res.json())
      .then((json) => {
        setAssessment(Object.values(json));
        
      });
      
      
  }, [getAsessments]);

  const toggleActivity = (assessment_id: number, status: string) => {
    const active = status == "true" ? "false" : "true";
    fetch(`http://127.0.0.1:8000/admin/assessment/activity`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        assessment_id: assessment_id,
        active: active,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          alert("Unprocessable Entity: Request data is invalid.");
        } else if (res.status === 200) {
          return res.json();
        } else if (res.status === 500) {
          // Handle other status codes here
          alert("TechID Already Exists");
        }
      })
      .then((data) => {
        console.log(data);
        setgetAssessments(getAsessments == true ? false : true);
      });
  };
  return (
    <>
      <Text
        size="xxlarge"
        textAlign="start"
        margin={{ top: "small", bottom: "small" }}
      >
        Assessments
      </Text>
      <Box
        align="stretch"
        justify="start"
        direction="column"
        pad="small"
        gap="small"
      >
        <Card width="medium">
          <CardBody pad="small">
            <Text>Create New Assessment</Text>
            <FormField label="Assessment ID" id="SetAssessment" onChange={(e)=>setAssessmentID(parseInt(e.target.value))}>
              <TextInput />
            </FormField>
            <FormField label="Assessment Name" onChange={(e)=>setAssessmentName(e.target.value)}>
              <TextInput />
            </FormField>
            <Button label="Set" onClick={AddAssessments}/>
          </CardBody>
          <CardFooter
            align="center"
            direction="row"
            flex={false}
            justify="between"
            gap="medium"
            pad="small"
          ></CardFooter>
        </Card>
        <Grid columns={{ size: "medium", count: "fill" }}>
          {assessment.map((assessments) => (
            
          <Card width="medium" key={assessments.assessment_id} margin="small">
            <CardHeader
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              <Text>Assessment ID - {assessments.assessment_id}</Text>
              <Text>Created By - {assessments.created_by}</Text>
              
            </CardHeader>
            <CardBody pad="small">
              
              <Text>Assessment Name - {assessments.assessment_name}</Text>
            </CardBody>
            <CardFooter
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              <Button icon={<Trash />} onClick={()=>Delete_Assessment(assessments.assessment_id)} />
              <Button
                label={String(assessments.is_active) == "true" ? "Deactivate" : "Activate"}
                secondary
                onClick={()=>toggleActivity(assessments.assessment_id, String(assessments.is_active))}
              ></Button>
              <Button label="Edit" reverse={false} primary={false} secondary  href={`assessment/create/${techid}/${assessments.assessment_id}/${assessments.assessment_name}`}/>
            </CardFooter>
          </Card>
           ))}
        </Grid>
      </Box>
    </>
  );
}

export default AssessmentComp;
