import {
  Card,
  Box,
  TextInput,
  RadioButtonGroup,
  DropButton,
  Button,
  Text,
  DataTable,
  Layer,
  Grommet,
} from "grommet";
import { Add } from "grommet-icons";
import React, { useDebugValue, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewSolution from "./ViewSolution";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { hpe } from "grommet-theme-hpe";

interface QuizQuestions {
  question_id: number;
  question: string;
  options: string[];
}
interface AttemptRecord {
  question_id: number;
  choice: string;
}

interface Result {
  scored: number;
  max_mark: number;
  wrong_ans: number[]
}

function AttemptQuiz() {
  const { quizid, quizname } = useParams();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestions[]>([]);
  const [attemptRecord, setAttemptRecord] = useState<AttemptRecord[]>([]);
  const [result, setResult] = useState<Result>()
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false)
  const user = useSelector((state: RootState) => state.accessControl);


  const GetQuiz = () => {
    fetch(`http://127.0.0.1:8000/admin/get/quiz/questions?quizid=${quizid}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizQuestions(Object.values(data));
      });
      
  };
  useEffect(() => {
    GetQuiz();
    console.log(user.quiz_attempts)
    console.log(quizid)
    if(quizid && user.quiz_attempts.includes(parseInt(quizid))){
      setSubmitted(true)
    }
  }, [quizid]);

  const handleChoiceChange = (questionId: number, selectedChoice: string) => {
    const updatedAttemptRecord = [...attemptRecord];
    const index = updatedAttemptRecord.findIndex(
      (record) => record.question_id === questionId
    );
    if (index !== -1) {
      updatedAttemptRecord[index].choice = selectedChoice;
    } else {
      updatedAttemptRecord.push({
        question_id: questionId,
        choice: selectedChoice,
      });
    }
    setAttemptRecord(updatedAttemptRecord);
  };
  const submitAttempt = ()=>{
    const attempts = attemptRecord.map((record) => ({
      question_id: record.question_id,
      choice: record.choice,
    }));
    fetch(`http://127.0.0.1:8000/adminuser/submit/quiz?quizid=${quizid}`,{
      method:"POST",
      headers:{
        "Content-type": "application/json"
      },
      body:JSON.stringify({ attempts })
    })
    .then(res => res.json())
    .then((data)=>{
      setResult(data)
      
    })
  }

  useEffect(()=>{
  
    if(result && quizid){
      console.log(result)
      fetch(`http://127.0.0.1:8000/record/quiz/attempt`,{
        method:"POST",
        headers:{
          "Content-type": "application/json"
        },
        body:JSON.stringify({
          quiz_id: parseInt(quizid),
          user_id: user.user_id,
          scored: result.scored,
          max: result.max_mark,
          wrong_ans: result.wrong_ans
        })
      })
      .then(res =>res.json())
      .then((data)=>{
        console.log(data)
        setSubmitted(true)
      })
    }
  },[result])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';

      const confirmationMessage = 'You have unsaved changes. Are you sure you want to refresh?';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
    <Grommet theme={hpe}>
    {submitted?
    <ViewSolution />
    :
      <Box pad={"medium"} gap="medium">
        <Text size="large">Attempting Quiz</Text>
        <Text size="large">
          Quiz ID - {quizid} | Quiz Name - {quizname}
        </Text>
        <Box pad={{ vertical: "small", horizontal: "15%" }} gap="medium">
          {quizQuestions.map((question) => (
            <Card pad="medium">
              <Box align="stretch" justify="center">
                <Box align="stretch" justify="center" gap="small">
                  <Text>{question.question_id}</Text>
                  <Text>{question.question}</Text>
                  <RadioButtonGroup
                    id="power-stzw"
                    name="power-regulation"
                    options={question.options}
                    onChange={(event) =>
                      handleChoiceChange(
                        question.question_id,
                        event.target.value
                      )
                    }
                  />
                </Box>
              </Box>
            </Card>
          ))}
          <Box align="center" justify="center">
            <Button label="Submit" primary onClick={() => setConfirm(true)} />
          </Box>
          {confirm === true ? (
            <>
              <Layer
                animate
                modal={false}
                position="center"
                full="horizontal"
                margin="xlarge"
              >
                <Box height={"50%"} gap="medium" pad={"medium"}>
                  <Text size="large">Confirm Submission</Text>
                  <DataTable
                    columns={[
                      {
                        header: "Question ID",
                        property: "question_id",
                        primary: true,
                      },
                      { header: "Choice", property: "choice" },
                    ]}
                    data={attemptRecord}
                    step={50}
                  />
                  <Box align="center" justify="end" direction="row">
                    <Button label="Go Back" onClick={() => setConfirm(false)} />
                    <Button label="Complete Quiz" onClick={()=> submitAttempt()}/>
                  </Box>
                </Box>
              </Layer>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      }
      </Grommet>
    </>
  );
}

export default AttemptQuiz;
