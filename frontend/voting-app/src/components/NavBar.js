import React from "react";
import {
  Navbar,
  Container,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";

function NavBar(props) {
  return (
    <Navbar
      style={{ backgroundColor: "#201f48" }}
      className="justify-content-end"
    >
      <Container>
        <Navbar.Brand style={{ color: "#0dcaf0", fontSize: "30px" }} href="/">
          AlgoVoter
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          {props.connected && (
            <DropdownButton
              variant="info"
              id="choose-user"
              title={props.mainAccount ? props.mainAccount : ""}
              className="px-3"
            >
              {props.accounts.map((user) => (
                <Dropdown.Item
                  key={user}
                  onClick={() => props.handleUserUpdate(user)}
                >
                  {user}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          )}
          {props.connected && (
            <Button variant="info" onClick={props.refreshState}>
              Refresh
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
