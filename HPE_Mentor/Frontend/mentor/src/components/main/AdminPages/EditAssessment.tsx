import {
  Box,
  Header,
  Button,
  Text,
  FileInput,
  FormField,
  AccordionPanel,
  Grid,
  Accordion,
  TextArea,
  Markdown,
  Layer,
} from "grommet";
import { FormPrevious } from "grommet-icons";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import file from "path";
function EditAssessment() {
  const { assessmentname, assessmentid, techid } = useParams();
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [problemFile, setProblemFile] = useState<File | null>(null);
  const solution_fname =
    assessmentname?.trim().replace(/\s+/g, "_") + "_Solution";
  const problem_fname =
    assessmentname?.trim().replace(/\s+/g, "_") + "_Question";
  const [problemData, setProblemData] = useState<String>("");

  const [getProblem, setGetProblem] = useState<string | null>(null)
  const [getSolution, setGetSolution] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const UploadFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: number
  ) => {
    if (type === 1) {
      const file = event.target.files?.[0] || null;
      if (file) {
        setSolutionFile(file);
      }
    } else if (type === 0) {
      const file = event.target.files?.[0] || null;
      if (file) {
        setProblemFile(file);
      }
    }
  };
  const handleFileUpload = async (type: number) => {
    if (type === 1) {
      if (solutionFile) {
        const formData = new FormData();
        formData.append("file", solutionFile);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/admin/upload?fname=${solution_fname}&assessment_id=${assessmentid}`,
            {
              method: "POST",
              body: formData,
            }
          );
          alert("File uploaded Successfully");
          // Handle the server response as needed
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    } else if (type === 0) {
      if (problemFile) {
        const formData = new FormData();
        formData.append("file", problemFile);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/admin/upload?fname=${problem_fname}&assessment_id=${assessmentid}`,
            {
              method: "POST",
              body: formData,
            }
          );
          alert("File uploaded Successfully");
          // Handle the server response as needed
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    } else if (type === 2) {
      if (problemData) {
        // Your React string
        const reactString = `${problemData}`;

        // Create a Blob from the string
        const blob = new Blob([reactString], { type: "text/plain" });

        // Create a File object from the Blob
        const file = new File([blob], "reactFile.txt", { type: "text/plain" });

        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/admin/upload?fname=${problem_fname}&assessment_id=${assessmentid}`,
            {
              method: "POST",
              body: formData,
            }
          );
          alert("File uploaded Successfully");
          // Handle the server response as needed
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  const PreviewProblem = () => {
    fetch(
      `http://127.0.0.1:8000/admin/file?assessment_id=${assessmentid}&fname=${problem_fname}`
    )
      .then((res) => res.text())
      .then((data) => {
        setGetProblem(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
    fetch(
      `http://127.0.0.1:8000/admin/file?assessment_id=${assessmentid}&fname=${solution_fname}`
    )
      .then((res) => res.text())
      .then((data) => {
        setGetSolution(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

      setPreview(true)
  }

  return (
    <Box align="start" justify="start" fill="vertical">
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
      <Box
        align="stretch"
        justify="start"
        pad="medium"
        gap="medium"
        fill="horizontal"
      >

       <Box direction="row" justify="between">
        <Text textAlign="start" size="xlarge">
          Edit Assessment
        </Text>
        <Button label="Preview" alignSelf="end" secondary onClick={()=> PreviewProblem()}/>
        </Box>
        <Text size="medium">Upload Problem Statement File</Text>
        <Accordion>
          <AccordionPanel label="Problem Statement Editor">
            <Grid
              rows={["medium", "small"]}
              columns={["50%", "50%"]}
              areas={[
                ["Editor", "Output"],
                ["UploadButton", "UploadButton"],
              ]}
            >
              <Box gridArea="Editor" overflow={"scroll"} pad={"small"}>
                <TextArea
                  fill
                  onChange={(e) => {
                    setProblemData(e.target.value);
                  }}
                />
              </Box>
              <Box gridArea="Output" pad={"small"} overflow={"auto"}>
                <Markdown>{problemData}</Markdown>
              </Box>
              <Box gridArea="UploadButton" pad={"small"}>
                <Button
                  label="Upload File"
                  onClick={() => {
                    handleFileUpload(2);
                  }}
                />
              </Box>
            </Grid>
          </AccordionPanel>
        </Accordion>
        <FileInput
          onChange={(event) => {
            if (event) {
              UploadFile(event, 0);
            }
          }}
        />
        <Button
          label="Upload Problem"
          onClick={() => {
            handleFileUpload(0);
          }}
        ></Button>
        <Text size="medium">Upload Solution File</Text>
        <FileInput
          onChange={(event) => {
            if (event) {
              UploadFile(event, 1);
            }
          }}
        />
        <Button
          label="Upload Solution"
          onClick={() => {
            handleFileUpload(1);
          }}
        ></Button>
      </Box>


      {preview ===true? 
      <Layer
      onClickOutside={()=>setPreview(false)}
      animate
      modal={false}
      position="center"
      full="horizontal"
      margin="xlarge"
    >
    <Grid
    pad={"medium"}
    rows={["medium"]}
    columns={["50%","50%"]}
    areas={[["problem", "solution"]]}
      >
        <Box gridArea="problem" pad={"medium"} overflow={"scroll"}>
          <Text weight={"bold"}>Problem</Text>
          <Markdown>
          {String(getProblem)}
          </Markdown>
          </Box>
        <Box gridArea="solution" pad={"medium"} overflow={"scroll"}>
        <Text weight={"bold"}>Solution</Text>
          <Markdown>
          {String(getSolution)}
          </Markdown>
          </Box>
    </Grid>
    </Layer>
      :
      <></>
      
      }
    </Box>

  );
}

export default EditAssessment;
