import {
  Grommet,
  Box,
  Header,
  Button,
  PageContent,
  Heading,
  FormField,
  Menu,
  TextInput,
  RadioButton,
  Stack,
  Card,
  Text,
  List,
  RadioButtonGroup,
  DropButton,
} from "grommet";

import {
  FormPrevious,
  FormClose,
  FormAdd,
  FormTrash,
  Add,
} from "grommet-icons";
import { backgrounds, hpe } from "grommet-theme-hpe";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../app/store";

interface Quiz_Questions {
  quiz_id: number;
  question_id: number;
  question: string;
  options: string[];
  correct_option: string;
}

function EditQuiz() {
  const { quizid, quizname, techid } = useParams();
  const [quizquestions, setQuizQuestions] = useState<Quiz_Questions[]>([]);
  const [getquiz, setGetQuiz] = useState(0);
  const user = useSelector((state: RootState) => state.accessControl);
  const [question, setQuestion] = useState("");
  const [question_id, setQuestionID] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correct_option, setCorrectOption] = useState("");
  const [newOption, setNewOption] = useState("");

  const DeleteQuestion = (question_id: number) => {
    fetch(`http://127.0.0.1:8000/admin/deletequestion`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        quiz_id: quizid,
        question_id: question_id,
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
        setGetQuiz(getquiz + 1);
      });
  };
  //Get Quiz Questions
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/admin/quiz/questions?quizid=${quizid}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizQuestions(Object.values(data));
      });
  }, [getquiz]);

  const addNewOption = () => {
    // Check if the newOption is not empty before adding it to the options array
    if (newOption.trim() !== "") {
      setOptions([...options, newOption]);
      // Clear the newOption input field after adding it
      setNewOption("");
    }
  };

  const addQuestion = () => {
    if (question.length == 0) {
      alert("Question can't be empty");
      return;
    }
    if (options.length == 0) {
      alert("Options can't be empty");
      return;
    }
    if (correct_option.length == 0) {
      alert("Correct Option not chosen");
      return;
    }
    fetch(`http://127.0.0.1:8000/admin/create_question`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        quiz_id: quizid,
        question_id: question_id,
        question: question,
        options: options,
        correct_option: correct_option,
        creator: user.user_id,
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
      setGetQuiz(getquiz + 1);
      setOptions([])
      setCorrectOption("")
      setQuestion("")
      setQuestionID(question_id+1)
    });
    
  };
  return (
      <Box
        align="center"
        justify="start"
        background={{ dark: false, color: "background-back" }}
      >
        <Header
          align="center"
          direction="row"
          flex={false}
          justify="between"
          gap="medium"
          fill="horizontal"
          pad="medium"
        >
          <Button
            label="Back"
            icon={<FormPrevious />}
            gap="xsmall"
            primary={false}
            href={`/technologies/${techid}`}
          />
        </Header>
        <Header
          align="center"
          direction="row"
          flex={false}
          justify="between"
          gap="medium"
          fill="horizontal"
          pad={{ left: "medium", right: "medium" }}
        >
          <Heading>Create Quiz</Heading>
        </Header>
        <PageContent pad="medium">
          <Box
            align="center"
            justify="start"
            direction="row"
            pad="xsmall"
            gap="small"
          
          >
            <Text size="large">
              Quiz ID: {quizid} <br />
              Quiz Name: {quizname}{" "}
            </Text>
          </Box>
          <Box align="stretch" justify="center" pad="medium" gap="small" overflow={"scroll"}>
            <Text size="xlarge" textAlign="start">
              Quiz Content
            </Text>
            <Text>
              Instructions - Type the question, Add options, Select Correct
              option, Save
            </Text>
              {quizquestions.map((quiz) => (
                <>
                    <Text>Question ID - {quiz.question_id}</Text>
                    <Text size="large">{quiz.question}</Text>

                    <RadioButtonGroup
                      id={`${quiz.quiz_id}`}
                      name={quiz.question}
                      options={quiz.options}
                      value={quiz.correct_option}
                    />
                    <Box width={"xxsmall"} align="center">
                    <Button
                    icon={<FormTrash />}
                    secondary
                    onClick={() => DeleteQuestion(quiz.question_id)}
                  ></Button>
                  </Box>
                </>
              ))}

            <Card pad="medium">
              <Box align="stretch" justify="center">
                <Box align="stretch" justify="center" gap="small">
                  <TextInput
                    width={"small"}
                    placeholder="Question ID"
                    onChange={(e) => {
                      setQuestionID(parseInt(e.target.value));
                    }}
                  />
                  <TextInput
                    placeholder="Question"
                    onChange={(e) => {
                      setQuestion(e.target.value);
                    }}
                  />
                  <RadioButtonGroup
                    id="power-stzw"
                    name="power-regulation"
                    options={options}
                    value={correct_option}
                    onChange={(event) => setCorrectOption(event.target.value)}
                  />
                  <Box align="center" justify="center">
                    <DropButton
                      label="Add Option"
                      dropAlign={{ top: "bottom" }}
                      dropContent={
                        <Box
                          align="center"
                          justify="center"
                          pad="medium"
                          direction="row"
                        >
                          <TextInput
                            name="Option"
                            onChange={(e) => setNewOption(e.target.value)}
                          />
                          <Button icon={<Add />} onClick={addNewOption} />
                        </Box>
                      }
                    />
                    <Button label="Save" primary onClick={addQuestion} />
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </PageContent>
      </Box>
  );
}

export default EditQuiz;
