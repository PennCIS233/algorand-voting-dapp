import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { DropdownButton, Dropdown, Nav } from "react-bootstrap";

function NavBar(props) {
  return (
    <Navbar style={{ backgroundColor: "#201f48" }}>
      {props.connected && (
        <Container>
          <Navbar.Brand style={{ color: "#0dcaf0", fontSize: "30px" }} href="/">
            AlgoVoter
          </Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link
                style={{ color: "#0dcaf0" }}
                onClick={() => props.handlePageChange(false)}
              >
                Creator
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                style={{ color: "#0dcaf0" }}
                onClick={() => props.handlePageChange(true)}
              >
                Voter
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <DropdownButton
            variant="info"
            id="choose-user"
            title={props.mainAccount}
          >
            {props.accounts.map((user) => (
              <Dropdown.Item onClick={() => props.handleUserUpdate(user)}>
                {user}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Container>
      )}
      {!props.connected && (
        <Container>
          <Navbar.Brand style={{ color: "#0dcaf0", fontSize: "30px" }} href="/">
            AlgoVoter
          </Navbar.Brand>
        </Container>
      )}
    </Navbar>
  );
}

export default NavBar;
