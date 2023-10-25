import { Button, Header, Text, Nav, Box } from "grommet";
import { Hpe, User } from "grommet-icons";
import { Outlet } from "react-router-dom";

function Navbar() {

  const HandleLogout = () =>{
    localStorage.removeItem("user")

  }
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
      <Nav align="center" flex={false} direction="row">
        <Button label="Dashboard" href="/" reverse={false} />
        <Button label="Trainees" href="/trainees/" reverse={false} />
        <Button label="Technologies" href="/technologies/" reverse={false} />
        <Button href="/profile/" icon={<User />} />
      </Nav>
      <Button label="Logout" primary onClick={HandleLogout} href="/"/>
    </Header>
    <Outlet />
    </>
  );
}

export default Navbar;
