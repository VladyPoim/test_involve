import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { createInvoice } from "../redux/actions";
import API from "../api/Api";

const ExchangePage = ({ createInvoice }) => {
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [selectedWithdraw, setSelectedWithdraw] = useState("");

  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [withdrawOptions, setWithdrawOptions] = useState([]);

  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  //state to prevent infinity rerender on invoice or withdraw change
  const [invoiceToWithdraw, setInvoiceToWithdraw] = useState(true);

  const [exchangeInvoiceLoader, setExchangeInvoiceLoader] = useState(false);
  const [exchangeWithdrawLoader, setExchangeWithdrawLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  const conditionOfInput = selectedWithdraw && selectedInvoice ? true : false;

  //access to the history instance that you may use to navigate.
  const history = useHistory();

  //get data of currency options
  useEffect(() => {
    API.get("/payMethods")
      .then((res) => {
        const invoice = res.data.invoice;
        const resultInvoice = invoice.map(function (currency) {
          return {
            value: currency.name,
            label: currency.name,
            id: currency.id,
          };
        });
        setInvoiceOptions(resultInvoice);

        const withdraw = res.data.withdraw;
        let resultWithdraw = withdraw.map(function (currency) {
          return {
            value: currency.name,
            label: currency.name,
            id: currency.id,
          };
        });
        setWithdrawOptions(resultWithdraw);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //update withdraw value on invoice change
  useEffect(() => {
    if (conditionOfInput && invoiceAmount && invoiceToWithdraw) {
      const timeOutInput = setTimeout(() => {
        if (invoiceAmount === "0") {
          setWithdrawAmount("0");
        } else {
          setExchangeWithdrawLoader(true);
          const amount = parseFloat(invoiceAmount);
          API.get("/payMethods/calculate", {
            params: {
              base: "invoice",
              amount: amount,
              invoicePayMethod: selectedInvoice.id,
              withdrawPayMethod: selectedWithdraw.id,
            },
          })
            .then((res) => {
              const amount = res.data.amount;
              setWithdrawAmount(amount);
              setExchangeWithdrawLoader(false);
            })
            .catch((err) => {
              console.log(err);
              setExchangeWithdrawLoader(false);
            });
        }
      }, 500);
      return () => clearTimeout(timeOutInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceAmount, selectedInvoice]);

  //update invoice value on withdraw change
  useEffect(() => {
    if (conditionOfInput && withdrawAmount && !invoiceToWithdraw) {
      const timeOutInput = setTimeout(() => {
        if (withdrawAmount === "0") {
          setInvoiceAmount("0");
        } else {
          setExchangeInvoiceLoader(true);
          const amount = parseFloat(withdrawAmount);
          API.get("/payMethods/calculate", {
            params: {
              base: "withdraw",
              amount: amount,
              invoicePayMethod: selectedInvoice.id,
              withdrawPayMethod: selectedWithdraw.id,
            },
          })
            .then((res) => {
              const amount = res.data.amount;
              setInvoiceAmount(amount);
              setExchangeInvoiceLoader(false);
            })
            .catch((err) => {
              console.log(err);
              setExchangeInvoiceLoader(false);
            });
        }
      }, 500);
      return () => clearTimeout(timeOutInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawAmount, selectedWithdraw]);

  const handleChangeInvoiceOption = (selectedOption) => {
    setSelectedInvoice(selectedOption);
    setInvoiceToWithdraw(true);
    console.log(`Option selected:`, selectedOption);
  };

  const handleChangeWithdrawOption = (selectedOption) => {
    setSelectedWithdraw(selectedOption);
    setInvoiceToWithdraw(false);
    console.log(`Option selected:`, selectedOption);
  };

  const handleChangeInvoiceAmount = (value) => {
    setInvoiceAmount(value);
    setInvoiceToWithdraw(true);
  };

  const handleChangeWithdrawAmount = (value) => {
    setWithdrawAmount(value);
    setInvoiceToWithdraw(false);
  };

  const handleSubmit = () => {
    setSubmitLoader(true);
    setTimeout(() => {
      //check required field
      if (
        invoiceAmount &&
        withdrawAmount &&
        selectedWithdraw &&
        selectedInvoice
      ) {
        if (invoiceAmount === "0" || withdrawAmount === "0") {
          alert("0 is invalid input");
        } else {
          const floatInvoiceAmount = parseFloat(invoiceAmount);
          const floatWithdrawAmount = parseFloat(withdrawAmount);
          createInvoice({
            invoiceCurrency: selectedInvoice.value,
            invoiceCurrencyId: selectedInvoice.id,
            invoiceAmount: floatInvoiceAmount,
            withdrawCurrency: selectedWithdraw.value,
            withdrawCurrencyId: selectedWithdraw.id,
            withdrawAmount: floatWithdrawAmount,
          });
          history.push("/confirmation");
        }
      } else {
        alert("Enter all the data or check your input, please");
      }
      setSubmitLoader(false);
    }, 1000);
  };

  return (
    <div className="exchangeScreen__section">
      <div className="exchangeScreen__container container">
        <div
          className="exchangeForm"
          style={{ opacity: submitLoader ? 0.4 : 1 }}
        >
          <div className="exchangeForm__inputFields">
            <div className="inputField">
              <div className="inputField__title">Sell</div>

              <Select
                styles={customStyles}
                className="inputField__select"
                value={selectedInvoice}
                onChange={handleChangeInvoiceOption}
                options={invoiceOptions}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator,
                }}
              />

              <div className="inputField__sum">
                <input
                  value={invoiceAmount}
                  onChange={(e) => handleChangeInvoiceAmount(e.target.value)}
                  type="number"
                  disabled={!conditionOfInput}
                />

                {exchangeInvoiceLoader ? (
                  <div style={{ marginRight: 10 }}>
                    <Loader
                      type="Oval"
                      color="#3E7E7C"
                      height={18}
                      width={18}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="inputField">
              <div className="inputField__title">Buy</div>

              <Select
                styles={customStyles}
                className="inputField__select"
                value={selectedWithdraw}
                onChange={handleChangeWithdrawOption}
                options={withdrawOptions}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator,
                }}
              />

              <div className="inputField__sum">
                <input
                  value={withdrawAmount}
                  onChange={(e) => handleChangeWithdrawAmount(e.target.value)}
                  type="number"
                  disabled={!conditionOfInput}
                />

                {exchangeWithdrawLoader ? (
                  <div style={{ marginRight: 10 }}>
                    <Loader
                      type="Oval"
                      color="#3E7E7C"
                      height={18}
                      width={18}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="exchangeForm__submit">
            {submitLoader ? (
              <button>
                <Loader type="Oval" color="black" height={18} width={18} />
              </button>
            ) : (
              <button onClick={handleSubmit}>Exchange</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  createInvoice,
};

export default connect(null, mapDispatchToProps)(ExchangePage);

//styles for Select Component
const customStyles = {
  control: (base, state) => ({
    ...base,
    height: 46,
    minHeight: 46,
    boxShadow: "none",
    border: state.isFocused ? "2px solid #58B4AE" : "1px solid #CBCBCB",
    "&:hover": {
      border: state.isFocused ? "2px solid #58B4AE" : "1px solid #CBCBCB",
    },
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen && "rotate(180deg)",
    color: "white",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#F4F4F4" : "white",
    "&:hover": {
      backgroundColor: "rgba(88,180,174, 0.6)",
    },
    color: "#3A3A3A",
  }),
};

//dropdown indicator for Select Component
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      {props.isFocused ? (
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 6L0 0L10 9.08524e-07L5 6Z" fill="#58B4AE" />
        </svg>
      ) : (
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 6L0 0L10 9.08524e-07L5 6Z" fill="#3A3A3A" />
        </svg>
      )}
    </components.DropdownIndicator>
  );
};
