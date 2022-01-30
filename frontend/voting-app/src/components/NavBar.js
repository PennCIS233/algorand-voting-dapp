import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">AlgoVoter</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBar;
