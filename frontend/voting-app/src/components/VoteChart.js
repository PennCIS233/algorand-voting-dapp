import Container from "react-bootstrap/Container";
import { PieChart } from "react-minimal-pie-chart";

function VoteChart(props) {
  return (
    <Container className="pr-5">
      <PieChart
        data={props.currVotes}
        label={({ dataEntry }) => dataEntry.value}
        labelStyle={(index) => ({
          fill: props.currVotes[index].color,
          fontSize: "5px",
          fontFamily: "sans-serif",
        })}
        radius={42}
        labelPosition={112}
      />
    </Container>
  );
}

export default VoteChart;
