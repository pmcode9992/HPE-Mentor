import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Meter,
  Text,
  Box,
  Grid,
  Button,
} from "grommet";
import { CatalogOption } from "grommet-icons";
import { backgrounds } from "grommet-theme-hpe";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import userEvent from "@testing-library/user-event";

interface TechnologyCard {
  technology_id: number;
  technology_name: string;
  progress: number;
}

function UserTutorials() {
  const user = useSelector((state: RootState) => state.accessControl);
  const [alltechcards, setAllTechCards] = useState<TechnologyCard[]>([]);
  const [techcards, setTechcards] = useState<TechnologyCard[]>([]);
  const [enrolled, setEnrolled] = useState<number[]>([]);

  function getCourses() {
    let e: number[] = [];
    user.enrollments.map((i) => e.push(i));
    setEnrolled(e);
    fetch(`http://127.0.0.1:8000/adminuser/mycourses?uid=${user.user_id}`)
      .then((res) => res.json())
      .then((json) => {
        setTechcards(Object.values(json));
      });

    fetch(`http://127.0.0.1:8000/admin/read/technology/all`)
      .then((res) => res.json())
      .then((json) => {
        setAllTechCards(Object.values(json));
      });
  }

  useEffect(() => {
    getCourses();
  }, []);

  const EnrollUser = (techid: number) => {
    fetch(`http://127.0.0.1:8000/enroll`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        e_id: (user.user_id*100) + techid ,
        tech_id: techid,
        user_id: user.user_id,
      }),
    });
  };
  return (
    <Box pad={"medium"} gap="medium">
      <Text size="xxlarge">Tutorials</Text>
      <Text>
        Explore our curated selection of tutorials, meticulously designed to
        elevate your expertise. <br />
        From programming to creative arts, our concise tutorial cards offer
        quick insights. <br />
        Master your skills with a simple click. Discover a world of knowledge,
        elegantly.
      </Text>
      <Text size="large">Your Tutorials</Text>
      <Grid columns={{ size: "medium", count: "fill" }} gap={"medium"}>
        {techcards.map((tech) => (
          <Button href={`/HPEMentor/tutorial/${tech.technology_id}`}>
            <Card width="medium">
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
              <CardBody pad="medium">
                <Text size="xxlarge" color="black">
                  {tech.technology_name}
                </Text>
                <Text size="large" color="active-text">
                  Course ID - {tech.technology_id}
                </Text>
              </CardBody>
              <CardFooter
                align="center"
                direction="row"
                flex={false}
                justify="between"
                gap="medium"
                pad="small"
              >
                <Meter
                  thickness="xsmall"
                  value={tech.progress}
                  color="brand"
                  round
                />
              </CardFooter>
            </Card>
          </Button>
        ))}
      </Grid>
      <Text size="large">All Tutorials</Text>

      <Grid columns={{ size: "medium", count: "fill" }} gap={"medium"}>
        {alltechcards.map((tech, index) => (
          <Card width="medium" key={index}>
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
            <CardBody pad="medium">
              <Text size="xxlarge" color="black">
                {tech.technology_name}
              </Text>
              <Text size="large" color="active-text">
                Course ID - {tech.technology_id}
              </Text>
            </CardBody>
            <CardFooter
              align="center"
              direction="row"
              flex={false}
              justify="between"
              gap="medium"
              pad="small"
            >
              {user.enrollments.length > 0 ? (
                enrolled.includes(tech.technology_id) ? (
                  <Text>Already Enrolled</Text>
                ) : (
                  <Button label="Enroll" onClick={() => EnrollUser(tech.technology_id)} />
                )
              ) : (
                <>
                  {" "}
                  <Button label="Enroll" onClick={() => EnrollUser(tech.technology_id)} />
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}

export default UserTutorials;
