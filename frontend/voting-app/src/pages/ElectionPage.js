import React from "react";
import NavBar from "../components/NavBar";
import { Row, Card, Form, Button, Container } from "react-bootstrap";

class ElectionPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleElectionSubmit = this.handleElectionSubmit.bind(this);
  }
  handleElectionSubmit(e) {
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
          <Row>
            <Card className="mt-5" bg="light">
              <Card.Header>Election ID</Card.Header>
              <Card.Body>
                <Form onSubmit={this.handleElectionSubmit}>
                  <Form.Group className="mb-3" controlId="electionId">
                    <Form.Control
                      type="election"
                      placeholder="Enter election id"
                    />
                  </Form.Group>
                  <Button variant="info" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </>
    );
  }
}

export default ElectionPage;
