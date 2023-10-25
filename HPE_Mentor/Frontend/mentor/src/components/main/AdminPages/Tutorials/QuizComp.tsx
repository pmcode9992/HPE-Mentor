import {
  Box,
  Card,
  CardBody,
  FormField,
  TextInput,
  Button,
  CardFooter,
  CardHeader,
  Text,
  Grid,
} from "grommet";
import { Next, Trash } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../app/store";
import { count } from "console";

interface Quizzes {
  technology_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_active: string;
  is_deleted: string;
  quiz_id: number;
  quiz_name: string;
  created_by: number;
}

function QuizComp() {
  const { techid } = useParams();
  const [quiz_id, setQuizID] = useState(0);
  const [quiz_name, setQuizName] = useState("");
  const [quiz, setQuiz] = useState<Quizzes[]>([]);
  const user = useSelector((state: RootState) => state.accessControl);
  const [getQuiz, setGetQuiz] = useState(false)

  const AddQuiz = () => {
    fetch("http://127.0.0.1:8000/admin/createquiz", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tech_id: techid,
        quiz_id: quiz_id,
        quiz_name: quiz_name,
        creator: user.user_id,
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
        setGetQuiz(getQuiz===true? false: true)
        
      });
  };
  const DeleteQuiz = (quizid : number)=>{

    console.log(quizid)
    fetch(`http://127.0.0.1:8000/admin/deletequiz`,
    {method:"POST",
    headers:{
      "Content-type" : "application/json"
    },
    body:JSON.stringify({
      "quiz_id" : quizid
    })
  }
    )
    .then((res)=>{
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
    .then((data)=>{
      setGetQuiz(getQuiz===true? false: true)
    })
  }


  // Get quizzes
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/admin/getallquizcards?techid=${techid}`)
      .then((res) => res.json())
      .then((json) => {
        setQuiz(Object.values(json));
      });
  }, [getQuiz]);

  const toggleActivity= (quiz_id: number, status: string) =>{
    const active = status == "true"? "false" : "true"
    fetch(`http://127.0.0.1:8000/admintoggle/activity`,
    {
      method:"POST",
      headers:{
        "Content-type":"Application/json"
      }
      ,
      body:JSON.stringify({
        "quiz_id": quiz_id,
        "active": active
      })
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
      setGetQuiz(getQuiz==true? false: true)
    });
  }
  return (
    <>
      <Text
        size="xxlarge"
        textAlign="start"
        margin={{ top: "small", bottom: "small" }}
      >
        Quizzes
      </Text>
      <Box
        align="stretch"
        justify="start"
        direction="column"
        pad="small"
        gap="small"
      >
        {/* Create Quiz Here */}
        <Card width="medium">
          <CardBody pad="small">
            <Text>Create New Quiz</Text>
            <FormField label="Quiz ID" id="SetQuiz">
              <TextInput
                onChange={(e) => setQuizID(parseInt(e.target.value))}
              />
            </FormField>
            <FormField label="Quiz Name">
              <TextInput onChange={(e) => setQuizName(e.target.value)} />
            </FormField>
            <Button label="Set" onClick={AddQuiz} />
          </CardBody>
          <CardFooter
            align="center"
            direction="row"
            flex={false}
            justify="between"
            gap="medium"
            pad="small"
          >
          </CardFooter>
        </Card>
        {/* Show cards here */}
        <Grid columns={{ size: "medium", count: "fill"}}>
        {quiz.map((quiz) => (
          <Card width="medium" key={quiz.quiz_id} margin="small">
            <CardHeader
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              <Text>Quiz ID - {quiz.quiz_id}</Text>
              <Text>Created By - {quiz.created_by}</Text>
            </CardHeader>
            <CardBody pad="small">
               <Text>Quiz Name - {quiz.quiz_name}</Text>

             
            </CardBody>
            <CardFooter
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              <Button icon={<Trash />} onClick={()=>DeleteQuiz(quiz.quiz_id)} />
              <Button label={String(quiz.is_active)== "true"? "Deactivate" : "Activate"} secondary onClick={()=>toggleActivity(quiz.quiz_id, String(quiz.is_active))}></Button>
              <Button label="Edit" reverse={false} primary={false} secondary href={`quiz/create/${techid}/${quiz.quiz_id}/${quiz.quiz_name}`} />
            </CardFooter>
          </Card>
        ))}
        </Grid>
      </Box>
    </>
  );
}

export default QuizComp;
