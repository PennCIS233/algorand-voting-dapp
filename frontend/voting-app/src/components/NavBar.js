import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { DropdownButton, Dropdown, Nav } from "react-bootstrap";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: ["account1", "account2"],
      currUser: "account1",
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(user) {
    this.setState({ currUser: user });
  }

  render() {
    return (
      <Navbar style={{ backgroundColor: "#201f48" }}>
        {this.props.connected && (
          <Container>
            <Navbar.Brand
              style={{ color: "#0dcaf0", fontSize: "30px" }}
              href="/"
            >
              AlgoVoter
            </Navbar.Brand>

            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link style={{ color: "#0dcaf0" }}>Creator</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={{ color: "#0dcaf0" }}>Voter</Nav.Link>
              </Nav.Item>
            </Nav>

            <DropdownButton
              variant="info"
              id="choose-user"
              title={this.state.currUser}
            >
              {this.state.users.map((user) => (
                <Dropdown.Item onClick={() => this.handleClick(user)}>
                  {user}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Container>
        )}
        {!this.props.connected && (
          <Container>
            <Navbar.Brand
              style={{ color: "#0dcaf0", fontSize: "30px" }}
              href="/"
            >
              AlgoVoter
            </Navbar.Brand>
          </Container>
        )}
      </Navbar>
    );
  }
}

export default NavBar;
