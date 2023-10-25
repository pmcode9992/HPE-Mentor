import {
  Box,
  Button,
  FileInput,
  Grid,
  Tab,
  Tabs,
  Text,
  Notification,
  Markdown,
  List,
  Grommet
} from "grommet";
import React, { useEffect, useState } from "react";
import UserNavBar from "../../header/UserNavbar";
import Footer from "../../footer/Footer";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { render } from "@testing-library/react";
import { hpe } from "grommet-theme-hpe";

interface Attempt {
  attempt_id: number;
  attempt_date: string;
  submitted_at: string | null;
  viewed_solution: boolean;
  user_id: number;
  assessment_id: number;
}

function AssessmentPage() {
  const user = useSelector((state: RootState) => state.accessControl);
  const [attemptinfo, setAttemptInfo] = useState<Attempt | null>(null);
  const [getAttempt, setGetAttempt] = useState(0);
  const { assessmentid, assessmentname } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const question_fname =
    assessmentname?.trim().replace(/\s+/g, "_") + "_Question";
  const solution_fname =
    assessmentname?.trim().replace(/\s+/g, "_") + "_Solution";
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);

  const downloadSolution = () => {
    if (solution) {
      const confirm  = window.confirm("Confirm download")
      if(confirm)
     { const content = solution;
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "solution";
      a.click();
      window.URL.revokeObjectURL(url);}
    } 
    else {
      alert("Error downloading");
    }
  };

  const UploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSubmissionFile(file);
    }
  };
  const handleFileUpload = async () => {
    if (submissionFile) {
      const submission_fname = String(user.user_id);
      const formData = new FormData();
      formData.append("file", submissionFile);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/admin/upload?fname=${submission_fname}&assessment_id=${assessmentid}`,
          {
            method: "POST",
            body: formData,
          }
        );

        // Handle the server response as needed
        setSubmitted(true);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const GetAttemptDetails = () => {
    fetch(
      `http://127.0.0.1:8000/get/attempt/data?userid=${user.user_id}&assessmentid=${assessmentid}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAttemptInfo(data);
      })
      .catch((error)=>{
        console.error(error)
      });
  };
  const RevealSolution = () => {
    fetch(
      `http://127.0.0.1:8000/viewedsolution?userid=${user.user_id}&assessmentid=${assessmentid}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        GetAttemptDetails()
      })
      .catch((error)=>{
        console.error(error)
      });
    //Reveal Solution
    fetch(
      `http://127.0.0.1:8000/admin/file?assessment_id=${assessmentid}&fname=${solution_fname}`
    )
      .then((res) => res.text())
      .then((data) => {
        setSolution(data);
      })
      .catch(()=>{
        alert("solution not uploaded")
      });
  };
  const CreateAttempt = ()=>{
    fetch(`http://127.0.0.1:8000/create/attempt`,{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({
            assessment_id : assessmentid,
            user_id : user.user_id
          })
        })
        .then(res => res.json())
        .catch((error)=>{
        })

        GetAttemptDetails()
  }
  useEffect(() => {
    console.log(submissionFile);
  }, [submissionFile]);
  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/admin/file?assessment_id=${assessmentid}&fname=${question_fname}`
    )
      .then((res) => res.text())
      .then((data) => {
        setProblem(data);
      })
      .catch((error)=>{
        console.error(error)
      });

  }, []);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";

      const confirmationMessage =
        "You have unsaved changes. Are you sure you want to refresh?";
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    CreateAttempt()
  }, []);
  useEffect(()=>{
    if(submitted){
      fetch(`http://127.0.0.1:8000/submit/attempt?userid=4&assessmentid=1`,
      {
        method:"POST",
        headers:{
          "Content-type":"application/json"
        }
      })
      .then((res)=>res.json())
      .then(()=>{
         GetAttemptDetails()
      })
      .catch((error)=>{
        console.error(error)
      })
    }
  },[submitted])

  return (
    <Grommet theme={hpe}>
    <Grid
      fill
      rows={["auto", "large", "xxsmall"]}
      columns={["50%", "50%"]}
      areas={[
        ["header", "header"],
        ["description", "submission"],
        ["footer", "footer"],
      ]}
    >
      <Box gridArea="header" border>
        <UserNavBar />
      </Box>
      <Box gridArea="description" border overflow={"scroll"}>
        <Tabs justify="start">
          <Tab title="Description">
            <Box pad={"small"}>
              {problem ? (
                <Text size="medium" style={{ lineHeight: "1" }}>
                  <Markdown>{problem}</Markdown>
                </Text>
              ) : (
                "Loading description..." // Or you can show a loading spinner
              )}
            </Box>
          </Tab>
          <Tab title="Solution">
            <Box pad={"medium"} gap="medium">
              <Text size="medium">
                <b>Important Information</b> <br />
                <br />
                Note: Submissions are Disabled After Viewing the Solution <br />
                <br />
                Once you view the solution for a coding problem, please be aware
                that submission will be disabled for that problem. We encourage
                you to attempt the problem first and make your best effort to
                solve it before checking the solution. This will help you
                enhance your problem-solving skills and gain a deeper
                understanding of the topic. <br /> <br />
                Happy coding!
              </Text>
              <Button
                label="View Solution"
                secondary
                onClick={() => RevealSolution()}
              ></Button>
            </Box>
          </Tab>
          <Tab title="Submissions">

           
              {attemptinfo?
             ( 
               <Box pad={"medium"}>
                <List 
                data={[`Attempt Registered on  - ${String(attemptinfo?.attempt_date)}`,
                 `Last Recorded Submission - ${String(attemptinfo?.submitted_at)}`]}
                />
                </Box>
              )
              :
              <Box pad={"medium"}>Couldn't Fetch Attempt Details</Box>
              }
              
              
          
          </Tab>
        </Tabs>
      </Box>
      <Box gridArea="submission" border overflow={"scroll"}>
        {submitted === true ? (
          <>
            <Notification message="File Uploaded!" status="normal" toast />
          </>
        ) : (
          <></>
        )}
        <Box align="stretch" justify="start" pad="medium" gap="medium">
          {attemptinfo?.viewed_solution == true ? (
            <>
              <Text size="large">
                You can no longer submit to this assessment
              </Text>
              {solution !== null ? (
                <>
                <Button label="Download file" onClick={()=>downloadSolution()}/>
                 <Markdown>{solution}</Markdown>
                 </>
               
              ) : (
                <Button
                  label="show solution"
                  onClick={() => RevealSolution()}
                />
              )}
            </>
          ) : (
            <>
              <Text>
                Upload Code files here <br /> File should have extension of the
                format .java, .py, .cpp etc
              </Text>
              <FileInput
                onChange={(event) => {
                  if (event) {
                    UploadFile(event);
                  }
                }}
              />
              <Button
                label="Upload"
                onClick={() => {
                  handleFileUpload();
                }}
              ></Button>
            </>
          )}
        </Box>
      </Box>
      <Box gridArea="footer" border>
        <Footer />
      </Box>
    </Grid>
    </Grommet>
  );
}

export default AssessmentPage;
