import React from "react";
import "./Dashboard.css";
import ResetCalculator from "./ResetCalculator";
import PaymentList from "./PaymentList";

const minPaymentPercentage = 0.01;
const monthlyInterestPercentage = 1 / 100 / 12;

class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      curBalance: "",
      calculatedInterest: "",
      requiredPrincipal: "",
      minPayment: "",
      payment: "",
      formattedPayment: "",
      paymentList: [],
      prevId: 0,
      nbrOfNormalPayment: 0,
      message: "",
    };

    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  componentDidMount() {
    this.paymentButton = document.querySelector(".payment-button");
    this.paymentInput = document.querySelector("#payment-input");
    this.message = document.querySelector(".message");
  }

  static getDerivedStateFromProps(props, state) {
    if (props.id !== state.prevId) {
      const { loan, interestRate, id } = props;

      const calcNbrNormalPayment = () => {
        let balance = loan;
        let count = 0;
        let minPaymentOnCapital = 0;
        while (balance > 0) {
          minPaymentOnCapital = (balance * minPaymentPercentage).toFixed(2);
          minPaymentOnCapital =
            minPaymentOnCapital < 0.01 ? 0.01 : minPaymentOnCapital;
          balance = (balance - minPaymentOnCapital).toFixed(2);
          count += 1;
        }
        return count;
      };

      return {
        curBalance: loan,
        calculatedInterest: (
          loan *
          interestRate *
          monthlyInterestPercentage
        ).toFixed(2),
        requiredPrincipal: (loan * minPaymentPercentage).toFixed(2),
        minPayment: (
          loan * interestRate * monthlyInterestPercentage +
          loan * minPaymentPercentage
        ).toFixed(2),
        payment: "",
        formattedPayment: "",
        paymentList: [],
        prevId: id,
        nbrOfNormalPayment: calcNbrNormalPayment(),
      };
    }
    return null;
  }

  handleChange = ({ target: { value } }) => {
    const re = /^\d+$|^\d+\.$|^\d+\.\d{0,2}$/gm;
    if (re.test(value)) {
      this.setState({ payment: value }, () => {
        this.setState({ formattedPayment: this.state.payment });
      });
    }
  };

  handleBlur = () => {
    if (this.state.payment) {
      this.setState({
        formattedPayment: this.formatter.format(this.state.payment),
      });
    }
  };

  handleFocus = () => {
    this.setState({ payment: "", formattedPayment: "" });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.payment && parseFloat(this.state.curBalance) > 0) {
      if (parseFloat(this.state.payment) >= parseFloat(this.state.minPayment)) {
        const newBalance =
          this.state.curBalance -
          (this.state.payment - this.state.calculatedInterest);
        this.setState(
          {
            curBalance: newBalance <= 0 ? 0 : newBalance,
          },
          () => {
            if (this.state.curBalance == 0) {
              this.paymentButton.setAttribute("disabled", true);
              this.paymentInput.setAttribute("disabled", true);
              this.setState({
                formattedPayment: `${this.formatter.format(
                  newBalance * -1
                )} refund.`,
              });
              this.message.classList.add("open");
              this.setState({ message: "You are now debt free!" });
            }
            this.setState(
              {
                calculatedInterest: (
                  this.state.curBalance *
                  this.props.interestRate *
                  monthlyInterestPercentage
                ).toFixed(2),
              },
              () => {
                this.setState(
                  {
                    requiredPrincipal: (
                      this.state.curBalance * minPaymentPercentage
                    ).toFixed(2),
                  },
                  () => {
                    this.setState({
                      minPayment: (
                        this.state.calculatedInterest * 1 +
                        this.state.requiredPrincipal * 1
                      ).toFixed(2),
                    });
                  }
                );
              }
            );
            const newPayment = {
              payment: this.state.payment,
              id: Date.now(),
            };
            this.setState({
              paymentList: [newPayment, ...this.state.paymentList],
            });
          }
        );
      } else alert("Cannot pay less than the minimum.");
    }
  };

  resetCalc = () => {
    this.paymentButton.removeAttribute("disabled");
    this.paymentInput.removeAttribute("disabled");
    this.message.classList.remove("open");
    this.setState({ message: "" });
    this.props.resetCalc();
  };

  render() {
    const {
      curBalance,
      calculatedInterest,
      requiredPrincipal,
      minPayment,
      formattedPayment,
      paymentList,
      nbrOfNormalPayment,
      message,
    } = this.state;

    return (
      <div className="dashboard-container">
        <h4>Dashboard</h4>
        <h6>It will take {nbrOfNormalPayment} payments to be debt free.</h6>
        <p>
          The minimum payment percentage is :{" "}
          {(minPaymentPercentage * 100).toFixed(2)}%
        </p>
        <hr />
        <h6>Balance = {this.formatter.format(curBalance)}</h6>
        <h6>Interest = {this.formatter.format(calculatedInterest)}</h6>
        <h6>Required Principal = {this.formatter.format(requiredPrincipal)}</h6>
        <h6>Minimum Payment = {this.formatter.format(minPayment)}</h6>
        <form onSubmit={this.handleSubmit} id="payment-form">
          <button disabled style={{ display: "none" }}></button>
          <label htmlFor="payment-input">Enter Payment Amount</label>
          <div className="input-button-container">
            <input
              id="payment-input"
              type="text"
              autoComplete="off"
              placeholder="$"
              value={formattedPayment}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            <button className="payment-button">Pay</button>
          </div>
          <div className="message-container">
            <h6 className="message">{message}</h6>
          </div>
        </form>
        <PaymentList paymentList={paymentList} />
        <ResetCalculator resetCalc={this.resetCalc} />
      </div>
    );
  }
}

export default Dashboard;
