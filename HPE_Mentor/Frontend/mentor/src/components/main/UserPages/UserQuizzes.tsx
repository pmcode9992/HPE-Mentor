import {
  Box,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Grid,
  Layer,
  DataTable,
  List,
} from "grommet";
import { FormNext } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface QuizCard {
  technology_id: number| string;
  quiz_name: string;
  quiz_id: number;
  is_active: boolean;

}

interface Instructions{
  quizid: number;
  quizname: string
}

function UserQuizzes() {
  const [quizcard, setQuizCard] = useState<QuizCard[]>([]);
  const user = useSelector((state: RootState) => state.accessControl);
  const [showInstructions, setShowInstructions] = useState<Instructions>();
  const GetQuizzes = () => {
    fetch(`http://127.0.0.1:8000/adminuser/myquizzes`, {
      method: "POST",
      headers: {
        "Content-type": "application/JSON",
      },
      body: JSON.stringify(user.enrollments),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuizCard(Object.values(data));
      });
  };

  const GetTechname = async (techid: number)=>{
    await fetch(`http://127.0.0.1:8000/admintechnology/getname?techid=${techid}`)
    .then(res=>res.json())
    .then((data)=>{
      return data
    })
    .catch((error)=>{
      console.error(error)
    })
    return techid
  }
  useEffect(() => {
    GetQuizzes();
  }, []);

  return (
    <Box pad={"medium"} gap="medium">
      <Text textAlign="start" size="xlarge">
        Active Quizzes
      </Text>
      <Grid columns={{ size: "medium", count: "fill" }} gap={"medium"}>
        {quizcard.map((quiz, index) =>
          quiz.is_active == true ? (
            <>
              <Card width="medium" key={index}>
                <CardHeader
                  align="center"
                  direction="row"
                  flex={false}
                  justify="between"
                  gap="medium"
                  pad="small"
                >
                  <Text>Quiz ID - {quiz.quiz_id}</Text>
                  <Text color="red">Live</Text>
                </CardHeader>
                <CardBody pad="small">
                  <Text size="xlarge">{quiz.quiz_name}</Text>
                  <Text>{quiz.technology_id}</Text>
                </CardBody>
                <CardFooter
                  align="center"
                  direction="row"
                  flex={false}
                  justify="between"
                  gap="medium"
                  pad="small"
                >
                  {user.quiz_attempts.includes(quiz.quiz_id) ? (
                    <Text>Attempt Recorded</Text>
                  ) : (
                    <Button
                      label="Attempt"
                      icon={<FormNext />}
                      reverse
                      onClick={() => 
                      {  setShowInstructions({quizid: quiz.quiz_id, quizname: quiz.quiz_name}) }}
                    />
                  )}
                </CardFooter>
              </Card>
              {showInstructions !== undefined ? (
                <>
                  <Layer
                    animate
                    modal={false}
                    position="center"
                    margin="xlarge"
                    
                  >
                    <Box height={"60%"} gap="medium" pad={"medium"}>
                      <Text weight="bold">Quiz Instructions:</Text>
                      <List
                        pad="small"
                        data={[
                          `${showInstructions.quizid} |  ${showInstructions.quizname}`,
                          "It's time to attempt the MCQ Quiz!",
                          "Remember, you can only attempt the quiz once.",
                          "The quiz will not refresh during your attempt.",
                          "All questions are mandatory, so make sure to answer them all.",
                          "When you're ready, click the 'Complete Quiz' button to submit your answers.",
                        ]}
                      />
                    </Box>
                    <Box align="center" justify="end" direction="row">
                      <Button
                        label="Go Back"
                        onClick={() => setShowInstructions(undefined)}
                      />
                      <Button
                        label="Attempt Quiz"
                        href={`/HPEMentor/attempt/quiz/${showInstructions.quizid}/${showInstructions.quizname}`}
                      />
                    </Box>
                  </Layer>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )
        )}
      </Grid>
      <Text size="xlarge">All Quizzes</Text>
      <Grid columns={{ size: "medium", count: "fill" }} gap={"medium"}>
        {quizcard.map((quiz, index) => (
          <Card width="medium" key={index}>
            <CardHeader
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              <Text>Quiz ID - {quiz.quiz_id}</Text>
            </CardHeader>
            <CardBody pad="small">
              <Text size="xlarge">{quiz.quiz_name}</Text>
              <Text>{quiz.technology_id}</Text>
              {user.quiz_attempts.includes(quiz.quiz_id) ? (
                <Text color={"green!"}>Attempted</Text>
              ) : (
                <Text color={"red!"}>Not Attempted</Text>
              )}
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
        ))}
      </Grid>
    </Box>
  );
}

export default UserQuizzes;
