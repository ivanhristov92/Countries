import CountriesService from "./countries-service";
import moment from "moment";
import React, { Component } from "react";

export default class CountryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null
    };
  }

  componentDidMount() {
    CountriesService.fetchCountryByName(
      this.props.match.params.countryName
    ).then(country => {
      this.setState({
        country
      });
    });
  }

  calculateCurrentTime = () => {
    if (!this.state.country) return null;
    let timezone = this.state.country.timezones[0].replace("UTC", "");
    let currentTimeInCOuntry = moment()
      .utcOffset(timezone)
      .toString();
    return (
      <div>
        {timezone} {currentTimeInCOuntry}
      </div>
    );
  };

  // Флаг, Име, Население, Разговорен език, Валути, Регион, Часа в момента там
  render() {
    return (
      <React.Fragment>
        <div>{this.props.match.params.countryName}</div>
        {this.state.country && (
          <div>
            <img src={this.state.country.flag} />
            <div>{this.state.country.name}</div>
            <div>{this.state.country.population}</div>
            <div>{this.state.country.languages[0].name}</div>
            <ul>
              {this.state.country.currencies.map(c => {
                return c.name ? <li>{c.name}</li> : null;
              })}
            </ul>
            <div>{this.state.country.region}</div>
            <div>{this.calculateCurrentTime()}</div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
