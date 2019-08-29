import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CountryDetails from "./country-details";
import Home from "./home";
import Breadcrumbs from "./common-components/breadcrumbs";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className={"container"}>
          <Switch>
            <Route exact path="/" render={props => <Breadcrumbs />} />
            <Route
              exact
              path="/country/:countryName"
              render={props => (
                <Breadcrumbs country={props.match.params.countryName} />
              )}
            />
          </Switch>
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
