import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Text,
  Layer,
  List
} from "grommet";
import { FormNext } from "grommet-icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface AssesmentCard {
  technology_id: number;
  assessment_name: string;
  assessment_id: number;
  is_active: boolean;
}
interface Instructions{
  assessmentid: number;
  assessmentname : string;
}
function UserAssessments() {
  const [assessmentcard, setAssessmentCard] = useState<AssesmentCard[]>([]);
  const user = useSelector((state: RootState) => state.accessControl);
  const [showInstructions, setShowInstructions] = useState<Instructions>();

  const GetAssessments = () => {
    fetch(`http://127.0.0.1:8000/adminuser/myassessments`, {
      method: "POST",
      headers: {
        "Content-type": "application/JSON",
      },
      body: JSON.stringify(user.enrollments),
    })
      .then((res) => res.json())
      .then((data) => {
        setAssessmentCard(Object.values(data));
      });
  };
  useEffect(() => {
    GetAssessments();
  }, []);
  return (
    <Box pad={"medium"} gap="medium">
      <Text textAlign="start" size="xlarge">
        Active Assessments
      </Text>
      <Grid columns={{ size: "medium", count: "fill" }} gap={"medium"}>
        {assessmentcard.map((assessment, index) =>
          assessment.is_active === true ? (
            <Card width="medium" key={index}>
              <CardHeader
                align="center"
                direction="row"
                flex={false}
                justify="between"
                gap="medium"
                pad="small"
              >
                <Text>Assessment ID - {assessment.assessment_id}</Text>
                <Text color="red">Live</Text>
              </CardHeader>
              <CardBody pad="small">
                <Text size="xlarge">{assessment.assessment_name}</Text>
                <Text>{assessment.technology_id}</Text>
              </CardBody>
              <CardFooter
                align="center"
                direction="row"
                flex={false}
                justify="between"
                gap="medium"
                pad="small"
              >
                <Button label="Attempt" icon={<FormNext />} reverse onClick={()=>setShowInstructions({assessmentid: assessment.assessment_id, assessmentname: assessment.assessment_name})} />
              </CardFooter>
            </Card>
          ) : (
            <></>
          )
        )}
                      {showInstructions !== undefined ? (

                <>
                  <Layer
                    animate
                    modal={false}
                    position="center"
                    margin="xlarge"
                    
                  >
                    <Box height={"60%"} gap="medium" pad={"medium"} overflow={"scroll"}>
                      <Text weight="bold">Assessment Instructions:</Text>
                      <Text>Welcome to the coding assessment! This assessment is designed to evaluate your coding skills. Please read the following instructions carefully before you begin</Text>
                      <List
                      
                        pad="small"
                        data={[
                          `${showInstructions.assessmentid} |  ${showInstructions.assessmentname}`,
                          `
                          Problem Statement:
                          You will be provided with a coding problem or task that you need to solve. The specific problem statement will be presented once you start the assessment.`,
                          
                          `Assessment Duration:
                          There is no time limit for this assessment. You can work on the problem at your own pace. Take your time to understand the problem and develop a well-structured solution.`,
                          
                          `Number of Attempts:
                          You are allowed an unlimited number of attempts for this assessment. If you are not satisfied with your initial solution, you can always try again to improve your code.`,
                          
                          `Coding Environment:
                          You can write your code in the programming language of your choice. Ensure that you are familiar with the programming language you choose. You will need to provide the complete code to solve the problem.`,
                          
                          `Submission:
                          Once you are satisfied with your solution, you can submit your code. The submission process will be clearly outlined on the assessment page. Make sure to follow the submission instructions.`,
                          
                          `Testing and Evaluation:
                          After you submit your code, it will be tested against various test cases to evaluate its correctness and efficiency. Make sure your solution works correctly for all possible inputs.`,
                          
                          `Plagiarism:
                          Plagiarism is strictly prohibited. You must write the code entirely on your own. Using code from external sources without proper attribution is a violation of the assessment's integrity.`,
                          
                          `Feedback:
                          After you submit your solution, you may receive feedback or scores on your code. Use this feedback to improve your coding skills.`
                        ]}
                      />
                    </Box>
                    <Box align="center" justify="end" direction="row" pad={"medium"}>
                      <Button
                        label="Go Back"
                        onClick={() => setShowInstructions(undefined)}
                      />
                      <Button
                        label="Attempt Assessment"
                        href={`/attempt/assessment/${showInstructions.assessmentid}/${showInstructions.assessmentname}`}
                      />
                    </Box>
                  </Layer>
                </>
              ) : (
                <></>
              )}
      </Grid>
      <Box gap="medium">
        <Text size="xlarge">All Assessments</Text>
        <Grid columns={{ size: "medium", count: "fill" }} gap={"medium"}>
        {assessmentcard.map((assessment, index) => (
          <Card width="medium">
            <CardHeader
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              <Text>Assessment ID - {assessment.assessment_id}</Text>
            </CardHeader>
            <CardBody pad="small">
              <Text size="xlarge">{assessment.assessment_name}</Text>
              <Text>{assessment.technology_id}</Text>
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
        ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default UserAssessments;
