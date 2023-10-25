import React from "react";
import { useState, useEffect } from "react";
import {
  Grommet,
  Card,
  Text,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Page,
  PageContent,
  PageHeader,
  AccordionPanel,
  Box,
  FormField,
  TextInput,
  Accordion,
  Grid,
} from "grommet";
import { Trash, FormNext, CatalogOption, Add } from "grommet-icons";
import { hpe } from "grommet-theme-hpe";

interface Technology {
  technology_name: string;
  technology_id: number;
  created_by: string;
}

function Technologies() {
  const [technology, setTechnology] = useState<Technology[]>([]);
  const [techname, setTechName] = useState("");
  const [techid, setTechID] = useState(0);
  const [creator_id] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedtech, setSelectedTech] = useState<Technology>();
  const [edittech, setEditTech] = useState<Technology>();

  function GetAllTechnologies() {
    fetch("http://127.0.0.1:8000/admin/read/technology/all")
      .then((res) => res.json())
      .then((json) => {
        setTechnology(Object.values(json));
      });
  }

  function AddTechnology() {
    //Form Validation
    if (techname.length === 0) {
      alert("Technology name cannot be empty");
      return;
    }
    if (techid <= 0) {
      alert("Technology ID cannot be empty, 0 or negative number");
      return;
    }

    //POST Request
    fetch("http://127.0.0.1:8000/admin/create/technology", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        technology_name: techname,
        technology_id: techid,
        creator: creator_id,
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
      });
    setCount(count + 1);
  }
  function Deletesub() {
    fetch("http://127.0.0.1:8000/admin/technology/delete", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        technology_id: selectedtech?.technology_id,
      }),
    });
  }

  
  useEffect(() => {
    GetAllTechnologies();
  }, [count]);

  useEffect(() => {
    Deletesub();
    setCount(count - 1);
  }, [selectedtech]);

  return (
    <Grommet theme={hpe}>
      <Page
        background="background-back"
        flex="grow"
        pad={{ vertical: "large" }}
      >
        <PageContent gap="large">
          <PageHeader
            title="Technologies"
            subtitle={`Create | Update | Delete`}
          />
          <Accordion>
            <AccordionPanel label="Create Subject">
              <Box align="start" justify="center" pad="medium">
                <FormField label="Tech ID">
                  <TextInput
                    type="Number"
                    onChange={(e) => {
                      setTechID(parseInt(e.target.value));
                    }}
                  />
                </FormField>
                <FormField label="Name">
                  <TextInput
                    onChange={(e) => {
                      setTechName(e.target.value);
                    }}
                  />
                </FormField>
                <Button
                  onClick={AddTechnology}
                  active={false}
                  icon={<Add />}
                  primary
                  margin="small"
                  label="Create"
                />
              </Box>
            </AccordionPanel>
          </Accordion>
          <Grid columns={{ size: "medium", count: "fill" }}>
            {technology.map((tech) => (
              <Card width="medium" margin="small">
                <CardHeader
                  align="center"
                  direction="row"
                  flex={false}
                  justify="between"
                  gap="medium"
                  pad="small"
                >
                  <CatalogOption />
                </CardHeader>
                <CardBody pad="small">
                  <Text size="large" color="black">
                    {tech.technology_name}
                  </Text>
                  <Text>Technology id - {tech.technology_id}</Text>
                  <Text>Created By - {tech.created_by}</Text>
                </CardBody>
                <CardFooter
                  align="center"
                  direction="row"
                  flex={false}
                  justify="between"
                  gap="medium"
                  pad="small"
                >
                  <Button
                    icon={<Trash />}
                    reverse
                    disabled={false}
                    plain={false}
                    onClick={() => {
                      setSelectedTech(tech);
                    }}
                  />

                  <Button
                    label="Edit"
                    icon={<FormNext />}
                    onClick={() => {
                      setEditTech(tech);
                    }}
                    href={`/technologies/${edittech?.technology_id}`}
                    reverse
                    secondary
                  />
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </PageContent>
      </Page>
    </Grommet>
  );
}

export default Technologies;
