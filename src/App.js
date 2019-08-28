import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CountryDetails from "./CountryDetails";
import Home from "./Home";
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <span>
            <Link to="/">Countries</Link>
          </span>
          <Route
            exact
            path="/country/:countryName"
            render={props => (
              <span>
                {" > "}
                <Link to={`/country/${props.match.params.countryName}`}>
                  {props.match.params.countryName}
                </Link>
              </span>
            )}
          />

          <hr />

          <Route exact path="/" render={() => <Home />} />
          <Route
            exact
            path="/country/:countryName"
            render={props => <CountryDetails {...props} />}
          />
        </div>
      </Router>
    );
  }
}
