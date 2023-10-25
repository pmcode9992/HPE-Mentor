import { Button, Header, Text, Nav, Box } from "grommet";
import { Hpe, User } from "grommet-icons";
import { Outlet } from "react-router-dom";



function UserNavBar() {


return (
    <>
    <Header
      align="center"
      direction="row"
      flex={false}
      justify="between"
      gap="medium"
      fill="horizontal"
      pad="medium"
    >
      <Box align="center" justify="center" direction="row" gap="small">
        <Hpe color="brand" />
        <Box align="center" justify="center" direction="row" gap="xsmall">
          <Text weight="bold" color="text-strong">
            HPE
          </Text>
          <Text color="text-strong">Mentor</Text>
       
         </Box>

       

      </Box>
    </Header>
    <Outlet />
    </>
  );
}

export default UserNavBar;
