import Card from "react-bootstrap/Card";
import { PieChart } from "react-minimal-pie-chart";

function VoteChart(props) {
  return (
    <Card bg="light">
      <Card.Header>Current Votes</Card.Header>
      <PieChart
        data={props.currVotes}
        label={({ dataEntry }) =>
          dataEntry.title + ": " + `${Math.round(dataEntry.percentage)} %`
        }
        labelStyle={(index) => ({
          fill: props.currVotes[index].color,
          fontSize: "3px",
          fontFamily: "sans-serif",
        })}
        radius={30}
        labelPosition={112}
        animate
      />
    </Card>
  );
}

export default VoteChart;
