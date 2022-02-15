import { Card, ListGroup, Container } from "react-bootstrap";
import { PieChart } from "react-minimal-pie-chart";

function ElectionInfoCard(props) {
  // createVoteFormat
  // Description:
  //  Transforms list of user votes into a JSON object
  // Parameters:
  //  votes (array) - list of number of votes for each option
  //  options (array) - list of vote options
  // Returns:
  //  returns (object) in the format that the PieChart component accepts
  const createVoteFormat = (votes, options) => {
    let res = [];
    const colors = ["#3181ba", "#45134c", "#632656", "#4dc8e9"];
    for (let i = 0; i < votes.length; i++) {
      if (votes[i]) {
        res.push({
          title: options[i],
          value: votes[i],
          color: colors[i % 4],
        });
      }
    }
    return res;
  };

  const currVotes = props.state["VoteOptions"]
    ? createVoteFormat(props.currVotes, props.state["VoteOptions"].split(","))
    : [];

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>Election Info</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          See how the election is going
        </Card.Subtitle>
        <ListGroup>
          <ListGroup.Item>
            <b>Creator Address: </b>
            {props.state["Creator"] ? props.state["Creator"] : ""}
          </ListGroup.Item>
          <ListGroup.Item>
            <b>Last Round to Vote: </b>
            {props.state["ElectionEnd"]}
          </ListGroup.Item>
          <ListGroup.Item>
            <b>Vote Options:</b> {props.state["VoteOptions"]}
          </ListGroup.Item>
          <ListGroup.Item>
            <b> Number of Voters:</b>{" "}
            {(props.currVotes &&
              Object.values(props.currVotes).reduce((a, b) => a + b, 0)) ||
              "0"}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default ElectionInfoCard;

/**
 * {currVotes.length > 0 && (
        <PieChart
          data={currVotes}
          label={({ dataEntry }) => dataEntry.title + `: ${dataEntry.value}`}
          labelStyle={(index) => ({
            fill: currVotes[index].color,
            fontSize: "5px",
            fontFamily: "sans-serif",
          })}
          radius={11}
          labelPosition={112}
          animate
        />
      )}
 */
