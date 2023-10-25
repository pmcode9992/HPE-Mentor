import React from "react";
import { Grid, Box } from "grommet";
import Usersidebar from "../sidebar/Usersidebar";
import UserNavBar from "../../header/UserNavbar";
import Footer from "../../footer/Footer";
import { useState } from "react";
import UserDashboard from "./UserDashboard";
import UserTutorials from "./UserTutorials";
import UserAssessments from "./UserAssessments";
import UserDiscussions from "./UserDiscussions";
import UserNotifications from "./UserNotifications";
import UserQuizzes from "./UserQuizzes";
import UserHelp from "./UserHelp";
import UserProfile from "./UserProfile";
function Dashboard() {
  const [content, setContent] = useState<string>("Dashboard");
  return (
    <Grid
      fill
      rows={["auto", "flex", "xxsmall"]}
      columns={["xsmall", "auto"]}
      areas={[["header", "header"], ["sidebar","main"], ["footer", "footer"]]}
    >
      <Box gridArea="header" border>
        <UserNavBar />
      </Box>
      <Box gridArea="sidebar">
        <Usersidebar setContent={setContent}/>
      </Box>
      <Box gridArea="main" border overflow={"scroll"}>
        {content === "UserProfile" && <UserProfile />}
        {content === "Dashboard" && <UserDashboard />}
        {content === "UserTutorials" && <UserTutorials />}
        {content === "UserQuizzes" && <UserQuizzes />}
        {content === "UserAssessments" && <UserAssessments />}
        {content === "UserDiscussions" && <UserDiscussions />}
        {content === "UserNotification" && <UserNotifications />}
        {content === "UserHelp" && <UserHelp />}
      </Box>
      <Box gridArea="footer" border>
        <Footer />
      </Box>
    </Grid>

  );
}

export default Dashboard;
