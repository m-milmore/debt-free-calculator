import React from "react";
import "./PaymentList.css";

class PaymentList extends React.Component {
  constructor() {
    super();
    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  render() {
    const { paymentList } = this.props;
    return (
      <div className="payment-list-container">
        <h5>Payment List</h5>
        <ul>
          {paymentList.map((payment) => (
            <li key={payment.id}>{this.formatter.format(payment.payment)}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default PaymentList;
