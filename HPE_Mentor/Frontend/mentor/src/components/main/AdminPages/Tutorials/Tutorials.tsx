import React, { useEffect } from "react";
import {
  Box,
  Header,
  Heading,
  NameValueList,
  NameValuePair,
  PageContent,
  Button,
  Grommet,

} from "grommet";
import { FormPrevious, Trash, Next } from "grommet-icons";
import { hpe } from "grommet-theme-hpe";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import TopicsComp from "./TopicsComp";
import QuizComp from "./QuizComp";
import AssessmentComp from "./AssessmentComp";

interface Technology {
  technology_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_active: string;
  is_deleted: string;
  technology_name: string;
  created_by: string;
  enrolled_students: number;
}


function Tutorials() {
  const user = useSelector((state: RootState) => state.accessControl);
  const { techid } = useParams();
  const [tech, setTech] = useState<Technology[]>([]);

  const GetTech = ()=>{
    fetch(`http://127.0.0.1:8000/admin/read/technology/byID?techid=${techid}`)
      .then((res) => res.json())
      .then((json) => {
        setTech(Object.values(json));
      });
  }
  //GET Tech Details
  useEffect(() => {
    GetTech()
    
  }, [techid]);

  const ToggleActivity =()=>{
   const state = ((String(tech[0].is_active) === "true")? false : true)
    fetch(`http://127.0.0.1:8000/admintechnology/is_active/toggle?techid=${tech[0].technology_id}&is_active=${state}`)
    .then(res =>res.json())
    .then(()=>
    {GetTech()})
    .catch((error)=>console.error(error))
  }



  if (tech[0] === undefined) {
    return <div> Loading</div>;
  } else {
    const keyValuePairs = Object.entries(tech[0]);
    console.log(keyValuePairs);
    return (
      <>
        <Grommet theme={hpe}>
          <Box
            align="start"
            justify="start"
            fill="vertical"
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
                href="/technologies"
                gap="xsmall"
                primary={false}
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
              <Heading>{tech[0].technology_name}</Heading>
              <Button label={String(tech[0].is_active) === "true" ? "Deactivate" : "Activate"} secondary onClick={()=>ToggleActivity()}/>
            </Header>
            <PageContent pad="medium">
              <Box
                align="stretch"
                justify="start"
                pad="medium"
                gap="small"
                background={{ color: "background-back" }}
              >
                <NameValueList>
                  {keyValuePairs.map(([key, value]) => (
                    <NameValuePair name={key}>
                      {key === null ? <> {null}</> : String(value)}
                    </NameValuePair>
                  ))}
                </NameValueList>
                <TopicsComp />
                <QuizComp />
                <AssessmentComp />
              </Box>
            </PageContent>
          </Box>
        </Grommet>
      </>
    );
  }
}

export default Tutorials;
