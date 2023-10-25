import React, { useEffect, useState } from "react";
import { Grid, Box, Header, Button, Text } from "grommet";
import { Domain, FormPrevious, Hide, Youtube } from "grommet-icons";
import { useParams } from "react-router-dom";
import Tutorials from "../AdminPages/Tutorials/Tutorials";

interface Tutorials{
  technology_id : number;
  is_active : boolean;
  topic_id: string;
  topic_name : string;
  links : string;
}

function UserContent() {
  const [display, setDisplay] = useState('')
  const { techid } = useParams()
  const [tutorials, setTutorials] = useState<Tutorials[]>([])
  const GetLinks = ()=>{

    fetch(`http://127.0.0.1:8000/admin/gettopics?techid=${techid}`)
    .then(res => res.json())
    .then((data)=>{
      setTutorials(Object.values(data))
    })
  }

  useEffect(()=>{
    GetLinks()
  },[])
  useEffect(()=>{
    console.log(tutorials)
  },[tutorials])

  return (
    <>
      
      <Grid
        fill
        rows={["auto","auto", "flex"]}
        columns={["small", "flex"]}
        areas={[
          ["header","header"],
          ["sidebar", "title"],
          ["sidebar", "content"],
        ]}
      >
        <Box gridArea="header" border>
          <Header
        align="center"
        direction="row"
        flex={false}
        justify="between"
        gap="medium"
        fill="horizontal"
        pad="medium"
        background={{ color: "background-contrast" }}
      >
        <Button
          label="Back to home"
          icon={<FormPrevious />}
          gap="xsmall"
          primary={false}
          href="/"
        />
      </Header>
        </Box>

        <Box gridArea="sidebar" border background={{ color: "green!" }}>
          <Text margin={"medium"} size="xlarge">Course Content</Text>
          <Box
            align="start"
            justify="start"
            fill="vertical"
            pad={"xsmall"}
            gap="small"
          >
            {tutorials.map((tutorial, index)=>
              <Button tabIndex={index} label={tutorial.topic_name} icon={tutorial.links.includes("youtube")? <Youtube />: <Domain/>} size="small" onClick={()=>setDisplay(tutorial.links)}/>
            )} 
          </Box>
        </Box>
        
        <Box gridArea="title" margin={"medium"} gap="xsmall">
          <Text size="xlarge">Technology Name - {techid}</Text>
          <Text>Select the topic from the sidebar to display it in the main content</Text>
        </Box>
        <Box gridArea="content" margin={"medium"}>
          <Box border align="center" justify="center">
            {display.includes("youtube")?
            <iframe
        src={display}
        width="800px"
        height="600px"
        title="Embedded Link"
        
      />
            :
            <Button label="Go to website" href={display} />
            }
          
        </Box>
        </Box>
      </Grid>
    </>
  );
}

export default UserContent;
