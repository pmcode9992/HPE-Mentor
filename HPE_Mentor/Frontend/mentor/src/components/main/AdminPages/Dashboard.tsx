import { Box, Grid, Heading, Paragraph, Image } from 'grommet'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

function Dashboard() {
    const user = useSelector((state: RootState) => state.accessControl);
  return (
    <Grid
    rows={["flex"]}
    columns={["50%", "50%"]}
    areas = {[["text", "image"]]}
    >
    <Box align="stretch" pad="medium" width={"large"} background={"green!"} gridArea='text' >
    <Heading level={1} margin="none">
      Welcome to HPE Mentor,
    </Heading>
    <Paragraph size="large" margin={{ top: 'medium' }}>
        HPE Mentor is your one-stop platform for creating and managing tutorials, quizzes, and assessments. It's designed to assist administrators in providing freshers with the tools they need to learn and grow. <br /> <br />

        For administrators, HPE Mentor offers an intuitive interface to effortlessly curate educational content. For users, it's a dynamic learning hub where you can acquire new skills and knowledge with ease. <br /> <br />

        Welcome aboard!
      </Paragraph>
  </Box>
  <Box gridArea='image'>
    
  </Box>
  </Grid>
  )
}

export default Dashboard