import React from "react";
import "./ResetCalculator.css";

class ResetCalculator extends React.Component {
  handleClick = (e) => {
    e.preventDefault();
    this.props.resetCalc();
  };

  render(props) {
    return (
      <div>
        <button onClick={this.handleClick}>Reset Calculator</button>
      </div>
    );
  }
}

export default ResetCalculator;
