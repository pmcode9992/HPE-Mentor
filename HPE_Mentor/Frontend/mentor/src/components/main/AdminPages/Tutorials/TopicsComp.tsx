import { Box, Accordion, AccordionPanel, DataTable, FormField, TextInput, Button, Text } from 'grommet';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

interface Tutorials {
    technology_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    is_active: string;
    is_deleted: string;
    topic_id: number;
    topic_name: string;
    links: string[];
    created_by: number;
  }

function TopicsComp() {
    const { techid } = useParams()
    const [tut, setTut] = useState<Tutorials[]>([]);
    const [tutname, setTutName] = useState("");
    const [tutlink, setTutLink] = useState("");
    const [tutid, setTutID] = useState(0);
    const [deltutid, setDelTutID] = useState(0);
    const [gettopics, setGetTopics] = useState(0);
    //Delete Tutorial
  function DeleteTut() {
    if (deltutid === 0) {
      alert("Tutorial ID cannot be 0");
      return;
    }
    fetch(
      `http://127.0.0.1:8000/admin/deletetutorial?tutid=${deltutid}&techid=${techid}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {});

    setGetTopics(gettopics - 1);
  }
  //Add Tutorial
  function AddTut() {
    if (tutid <= 0) {
      alert("tutorial ID cannot be 0 or negative");
      return;
    }
    if (tutlink.length === 0) {
      alert("tutorial link cannot be empty");
      return;
    }
    fetch("http://127.0.0.1:8000/admin/createtopic", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tut_name: tutname,
        tut_id: tutid,
        tech_id: techid,
        creator: 1,
        link: tutlink.replace('watch?v=', "embed/"),
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          // Handle the 422 error here
          alert("Unprocessable Entity: Request data is invalid.");
        } else if (res.status === 200) {
          return res.json();
        } else if (res.status === 500) {
          // Handle other status codes here
          alert("TutID Already Exists");
        } else {
          alert("Unknown Error");
        }
      })
      .then((data) => {
      });
  }


  useEffect(() => {
    fetch(`http://127.0.0.1:8000/admin/gettopics?techid=${techid}`)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          console.error("Error Fetching Data");
        }
      })
      .then((data) => {
        setTut(Object.values(data));
      });
  }, [gettopics]);
  return (
    <>
    <Box align="stretch" justify="center" fill="horizontal">
                  <Text
                    size="xxlarge"
                    textAlign="start"
                    margin={{ top: "small", bottom: "small" }}
                  >
                    Tutorials
                  </Text>
                  <Accordion>
                    <AccordionPanel label="Topics">
                      <DataTable
                        columns={[
                          {
                            property: "topic_id",
                            header: "Tutorial ID",
                            align: "start",
                          },
                          {
                            header: "Tutorial",
                            property: "topic_name",
                            primary: true,
                          },
                          {
                            header: "link",
                            property: "links",
                          },
                        ]}
                        data={tut}
                        step={50}
                      />
                      <Accordion>
                        <AccordionPanel label="Add link">
                          <Box
                            align="center"
                            justify="between"
                            direction="row"
                            gap="xxsmall"
                            pad="xsmall"
                            hoverIndicator={false}
                          >
                            <FormField label="Tutorial ID">
                              <TextInput
                                width="small"
                                type="number"
                                onChange={(e) =>
                                  setTutID(parseInt(e.target.value))
                                }
                              />
                            </FormField>
                            <FormField label="Tutorial">
                              <TextInput
                                width="small"
                                onChange={(e) => setTutName(e.target.value)}
                              />
                            </FormField>

                            <FormField label="Link">
                              <TextInput
                                width="medium"
                                onChange={(e) => setTutLink(e.target.value)}
                              />
                            </FormField>
                            <Button
                              label="ADD"
                              primary
                              onClick={() => {
                                AddTut();
                                setGetTopics(gettopics + 1);
                              }}
                            />
                          </Box>
                        </AccordionPanel>
                        <AccordionPanel label="Delete link">
                          <Box
                            align="center"
                            justify="between"
                            direction="row"
                            gap="xxsmall"
                            pad="xsmall"
                            hoverIndicator={false}
                          >
                            <FormField label="Tutorial ID">
                              <TextInput
                                width="small"
                                type="number"
                                onChange={(e) =>
                                  setDelTutID(parseInt(e.target.value))
                                }
                              />
                            </FormField>
                            <Button
                              label="DELETE"
                              primary
                              onClick={() => {
                                DeleteTut();
                              }}
                            />
                          </Box>
                        </AccordionPanel>
                      </Accordion>
                    </AccordionPanel>
                  </Accordion>

                </Box>
    </>
  )
}

export default TopicsComp