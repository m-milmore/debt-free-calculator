import React from "react";
import "./Main.css";
import Dashboard from "./Dashboard";

class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      loan: 5000,
      formattedLoan: "",
      interestRate: 6.5,
      formattedInterestRate: "",
      id: 1,
    };

    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  componentDidMount() {
    this.formContainer = document.querySelector(".form-container");
    this.dashboard = document.querySelector(".dashboard-container");
    this.handleFocusLoan();
    this.handleBlurLoan();
    this.handleFocusInterest();
    this.handleBlurInterest();
  }

  handleChangeLoan = ({ target: { value } }) => {
    this.setState({ loan: value.replace(/\D/g, "") }, () => {
      this.setState({ formattedLoan: this.state.loan });
    });
  };

  handleChangeInterest = ({ target: { value } }) => {
    const re = /^\d?\d?\.?\d?\d?$/g;
    if (value.length >= 3 && !value.includes(".")) return;
    if (re.test(value)) {
      this.setState({ interestRate: value }, () =>
        this.setState({ formattedInterestRate: this.state.interestRate })
      );
    }
  };

  handleBlurLoan = () => {
    if (this.state.loan) {
      this.setState({ formattedLoan: this.formatter.format(this.state.loan) });
    }
  };

  handleBlurInterest = () => {
    if (this.state.interestRate) {
      this.setState({ formattedInterestRate: `${this.state.interestRate}%` });
    }
  };

  handleFocusLoan = () => {
    this.setState({ formattedLoan: this.state.loan });
  };

  handleFocusInterest = () => {
    this.setState({ formattedInterestRate: this.state.interestRate });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.loan && this.state.interestRate) {
      this.setState({ id: this.state.id * -1 });
      this.dashboard.classList.add("open");
      this.formContainer.style.pointerEvents = "none";
      this.formContainer.children[0].children[2].tabIndex = -1;
      this.formContainer.children[0].children[4].tabIndex = -1;
      this.formContainer.children[0].children[5].tabIndex = -1;
    }
  };

  resetCalc = () => {
    this.setState({
      loan: "",
      formattedLoan: "",
      interestRate: "",
      formattedInterestRate: "",
    });
    this.dashboard.classList.remove("open");
    this.formContainer.style.pointerEvents = "all";
    this.formContainer.children[0].children[2].tabIndex = 1;
    this.formContainer.children[0].children[4].tabIndex = 2;
    this.formContainer.children[0].children[5].tabIndex = 3;
  };

  render() {
    const { loan, formattedLoan, interestRate, formattedInterestRate, id } =
      this.state;

    return (
      <div className="main-div">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            <button disabled style={{ display: "none" }}></button>
            <label htmlFor="loan-input">Enter loan amount</label>
            <input
              id="loan-input"
              type="text"
              autoComplete="off"
              placeholder="$"
              value={formattedLoan}
              onFocus={this.handleFocusLoan}
              onChange={this.handleChangeLoan}
              onBlur={this.handleBlurLoan}
            />
            <label htmlFor="interest-rate-input">Enter interest rate</label>
            <input
              id="interest-rate-input"
              type="text"
              autoComplete="off"
              placeholder="%"
              value={formattedInterestRate}
              onFocus={this.handleFocusInterest}
              onChange={this.handleChangeInterest}
              onBlur={this.handleBlurInterest}
            />
            <button onClick={(e) => e.currentTarget.blur()}>Calculate</button>
          </form>
        </div>
        <Dashboard
          loan={loan}
          interestRate={interestRate}
          id={id}
          resetCalc={this.resetCalc}
        />
      </div>
    );
  }
}

export default Main;
