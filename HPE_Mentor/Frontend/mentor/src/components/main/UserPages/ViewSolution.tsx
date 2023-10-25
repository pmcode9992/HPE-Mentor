import { Box, Button, Card, Header, RadioButtonGroup, Text } from "grommet";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../app/store";
import { FormPrevious } from "grommet-icons";

interface QuizSolutions {
  question_id: number;
  question: string;
  options: string[];
  correct_option: string;
}
interface UserScore {
  score: number;
  max_score: number;
  wrong_ans: number[];
}
function ViewSolution() {
  const { quizid, quizname } = useParams();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [quizsolution, setQuizSolution] = useState<QuizSolutions[]>([]);
  const user = useSelector((state: RootState) => state.accessControl);
  const [loading, setLoading] = useState(true);

  const GetSolution = () => {
    fetch(`http://127.0.0.1:8000/admin/get/quiz/solution?quizid=${quizid}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizSolution(Object.values(data));
      })
      .catch((error) => {
        console.error("Error fetching quiz solutions:", error);
      });

    fetch(
      `http://127.0.0.1:8000/get/score?userid=${user.user_id}&quizid=${quizid}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUserScore(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching user score:", error);
      });
  };

  useEffect(() => {
    GetSolution();
  }, []);

  useEffect(() => {
    if (userScore) {
      setLoading(false);
    }
  }, [userScore]);

  return (
    <>
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
                label="Back to Home"
                icon={<FormPrevious />}
                href="/"
                gap="xsmall"
                primary={false}
              />
            </Header>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <Box pad={"medium"} gap="medium">
          <Text size="xlarge">Solution</Text>
          {userScore ? (
            <Text size="large" weight={"bold"}>
              Score - {userScore.score}/ {userScore.max_score}
            </Text>
          ) : (
            <Text>Score - N/A</Text>
          )}
          {quizsolution.map((question, index) => (
            <Card pad="medium" key={index}>
              <Box align="stretch" justify="center">
                <Box align="stretch" justify="center" gap="small">
                  <Text>{question.question_id}</Text>
                  <Text>{question.question}</Text>
                  <RadioButtonGroup
                    id="power-stzw"
                    name="power-regulation"
                    options={question.options}
                    value={question.correct_option}
                  />
                  <Text color={"red"} weight={"bold"}>
                    {userScore?.wrong_ans.includes(question.question_id)
                      ? "Incorrect!"
                      : ""}
                  </Text>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}

export default ViewSolution;
