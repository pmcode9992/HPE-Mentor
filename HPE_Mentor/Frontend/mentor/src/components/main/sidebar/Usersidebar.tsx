import { Sidebar, Avatar, Button, Box, Tip, Text } from "grommet";
import {
  StatusUnknown,
  Catalog,
  ChatOption,
  Notification,
  Clock,
  Terminal,
  Dashboard
} from "grommet-icons";


interface UsersidebarProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const Usersidebar: React.FC<UsersidebarProps> = ({ setContent }) => {
  
  return (
    <Sidebar pad="medium" flex={false} background={"green!"}>
      <Avatar
        margin={{ bottom: "medium" }}
        src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80"
        onClick={()=>{setContent("UserProfile") }}
      />
      <Box flex="grow" gap="2.5%">
        <Tip
          content={
              <Box width={{ max: "small" }} round="xsmall">
              <Text >Dashboard</Text>
            </Box>
          }
        >
          <Button a11yTitle="Catalog" icon={<Dashboard />} onClick={()=>{setContent("Dashboard") }} />
        </Tip>
        <Tip
          content={
              <Box width={{ max: "small" }} round="xsmall">
              <Text >Tutorials</Text>
            </Box>
          }
        >
          <Button a11yTitle="Catalog" icon={<Catalog />} onClick={()=>{setContent("UserTutorials") }} />
        </Tip>
        <Tip
          content={
            <Box width={{ max: "small" }} round="xsmall">
              <Text>Quizzes</Text>
            </Box>
          }
        >
          <Button a11yTitle="Clock" icon={<Clock />} onClick={()=>{setContent("UserQuizzes") }} />
        </Tip>
        <Tip
          content={
            <Box width={{ max: "small" }} round="xsmall">
              <Text>Assessments</Text>
            </Box>
          }
        >
          <Button a11yTitle="Terminal" icon={<Terminal />} onClick={()=>{setContent("UserAssessments") }} />
        </Tip>
      </Box>
      <Box>
        {/* <Tip
          content={
            <Box width={{ max: "small" }} round="xsmall">
              <Text>Notifications</Text>
            </Box>
          }
        >
          <Button a11yTitle="Notification" icon={<Notification />} onClick={()=>{setContent("UserNotification") }} />
        </Tip> */}
        <Tip
          content={
            <Box width={{ max: "small" }} round="xsmall">
              <Text>Help</Text>
            </Box>
          }
        >
          <Button a11yTitle="Help" icon={<StatusUnknown />}onClick={()=>{setContent("UserHelp") }}  />
        </Tip>
      </Box>
    </Sidebar>
  );
}

export default Usersidebar;
