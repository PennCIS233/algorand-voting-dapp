import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function NavBar() {
  return (
    <Navbar style={{ backgroundColor: "#201f48" }}>
      <Container>
        <Navbar.Brand style={{ color: "#0dcaf0" }} href="/">
          AlgoVoter
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBar;
