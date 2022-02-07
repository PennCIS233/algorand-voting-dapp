import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { DropdownButton, Dropdown } from "react-bootstrap";

function NavBar(props) {
  return (
    <Navbar style={{ backgroundColor: "#201f48" }}>
      <Container>
        <Navbar.Brand style={{ color: "#0dcaf0", fontSize: "30px" }} href="/">
          AlgoVoter
        </Navbar.Brand>
        {props.connected && (
          <DropdownButton
            variant="info"
            id="choose-user"
            title={props.mainAccount ? props.mainAccount.substring(0, 6) : ""}
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
      </Container>
    </Navbar>
  );
}

export default NavBar;
