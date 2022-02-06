import React from "react";
import { Row, Card, Form, Button, Container } from "react-bootstrap";
import NavBar from "../components/NavBar";

class ConnectPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleConnect = this.handleConnect.bind(this);
  }
  handleConnect(e) {
    e.preventDefault();
    console.log(this.state.electionId);
    this.setState({ disableElection: true });
    // TODO: search for election on blockchain
  }
  render() {
    return (
      <>
        <NavBar />
        <Container>
          <Row className="px-3 mt-3">
            <Row>
              <Card className="mt-5" bg="light">
                <Card.Header>Connect to AlgoSigner</Card.Header>
                <Card.Body>
                  <Form onSubmit={this.handleConnect}>
                    <Button variant="info" type="submit">
                      Connect
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Row>
          </Row>
        </Container>
      </>
    );
  }
}

export default ConnectPage;
