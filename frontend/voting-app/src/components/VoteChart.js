import { Card, ListGroup, Container } from "react-bootstrap";
import { PieChart } from "react-minimal-pie-chart";

// TODO: handle when sum of all currvotes is 0
function VoteChart(props) {
  const numVotes =
    props.state["VotesFor0"] +
    props.state["VotesFor1"] +
    props.state["VotesFor2"] +
    props.state["VotesFor3"];

  const currVotes = [
    { title: "A", value: props.currVotes[0], color: "#3181ba" },
    { title: "B", value: props.currVotes[1], color: "#45134c" },
    { title: "C", value: props.currVotes[2], color: "#632656" },
    { title: "D", value: props.currVotes[3], color: "#4dc8e9" },
  ];
  return (
    <Card bg="light" className="text-center">
      <Card.Header>Election Info</Card.Header>
      <ListGroup>
        <ListGroup.Item>
          Creator ID:{" "}
          {props.state["Creator"]
            ? props.state["Creator"].substring(0, 10)
            : ""}
        </ListGroup.Item>
        <ListGroup.Item>
          Registration Ends: {Date(props.state["ElectionEnd"] * 1000)}
        </ListGroup.Item>
        <ListGroup.Item>Number of Voters: {numVotes}</ListGroup.Item>
      </ListGroup>
      <Container className="px-5">
        <PieChart
          data={currVotes}
          label={({ dataEntry }) =>
            dataEntry.title + `: ${Math.round(dataEntry.percentage)} %`
          }
          labelStyle={(index) => ({
            fill: currVotes[index].color,
            fontSize: "5px",
            fontFamily: "sans-serif",
          })}
          radius={40}
          labelPosition={112}
          animate
        />
      </Container>
    </Card>
  );
}

export default VoteChart;
