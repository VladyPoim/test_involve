import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import ConfirmationPage from "./Pages/ConfirmationPage";
import ExchangePage from "./Pages/ExchangePage";
import SuccessPage from "./Pages/SuccessPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" component={ExchangePage} exact />
          <Route path="/confirmation" component={ConfirmationPage} />
          <Route path="/success" component={SuccessPage} />
          <Route component={ExchangePage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
