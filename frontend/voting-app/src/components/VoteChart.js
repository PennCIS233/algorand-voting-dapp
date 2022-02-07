import Card from "react-bootstrap/Card";
import { PieChart } from "react-minimal-pie-chart";

// TODO: handle when sum of all currvotes is 0
function VoteChart(props) {
  const currVotes = [
    { title: "A", value: props.currVotes[0], color: "#3181ba" },
    { title: "B", value: props.currVotes[1], color: "#45134c" },
    { title: "C", value: props.currVotes[2], color: "#632656" },
    { title: "D", value: props.currVotes[3], color: "#4dc8e9" },
  ];
  return (
    <Card bg="light">
      <Card.Header>Current Votes</Card.Header>
      <PieChart
        data={currVotes}
        label={({ dataEntry }) =>
          dataEntry.title + `: ${Math.round(dataEntry.percentage)} %`
        }
        labelStyle={(index) => ({
          fill: currVotes[index].color,
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
