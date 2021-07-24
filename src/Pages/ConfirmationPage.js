import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import API from "../api/Api";
import Loader from "react-loader-spinner";

const ConfirmationPage = ({ invoice }) => {
  const [confirmationLoader, setConfirmationLoader] = useState(false);

  //access to the history instance that you may use to navigate.
  const history = useHistory();

  //check that we have invoice data
  useEffect(() => {
    for (let key in invoice) {
      if (invoice[key] === null) {
        history.replace("/");
      }
    }
  });

  const handleCancel = () => {
    history.replace("/");
  };

  const handleConfirm = () => {
    setConfirmationLoader(true);
    API.post("/bids", {
      base: "invoice",
      amount: invoice.invoiceAmount,
      invoicePayMethod: invoice.invoiceCurrencyId,
      withdrawPayMethod: invoice.withdrawCurrencyId,
    })
      .then((res) => {
        if (res.data.message === "Success") {
          setConfirmationLoader(false);
          history.replace("/success");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Oops, try again later");
        setConfirmationLoader(false);
      });
  };

  return (
    <div className="confirmationScreen__section">
      <div className="confirmationScreen__container container">
        <div
          style={{ opacity: confirmationLoader ? 0.4 : 1 }}
          className="confirmationForm"
        >
          <div className="confirmationForm__title">Details</div>

          <div className="confirmationForm__details">
            <div className="details--title">Sell</div>

            <div className="details--value">
              {invoice.invoiceAmount} {invoice.invoiceCurrency}
            </div>
          </div>

          <div className="confirmationForm__details">
            <div className="details--title">Buy</div>

            <div className="details--value">
              {invoice.withdrawAmount} {invoice.withdrawCurrency}
            </div>
          </div>

          <div className="confirmationForm__buttons">
            <button
              onClick={handleCancel}
              className="confirmationForm__buttons--cancel"
            >
              Cancel
            </button>

            {confirmationLoader ? (
              <button className="confirmationForm__buttons--confirm">
                <Loader type="Oval" color="black" height={18} width={18} />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="confirmationForm__buttons--confirm"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    invoice: state.invoice,
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
