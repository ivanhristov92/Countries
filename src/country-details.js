import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CountriesService from "./services/countries-service";

export default class CountryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null
    };

    this.timer = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 1);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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

  _calculateCurrentTime = tz => {
    let timezone = tz.replace("UTC", "");
    return moment()
      .utcOffset(timezone)
      .toString();
  };

  renderCurrentTime = () => {
    if (!this.state.country) return null;
    let currentTimeInCountry = this._calculateCurrentTime(
      this.state.country.timezones[0]
    );
    return <div>{currentTimeInCountry}</div>;
  };

  render() {
    return (
      <React.Fragment>
        {this.state.country && (
          <div className={"details-table-container "}>
            <table className={"details-table"}>
              <tbody>
                <tr>
                  <th>Flag</th>
                  <td>
                    <img
                      width={100}
                      src={this.state.country.flag}
                      className={"flag"}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{this.state.country.name}</td>
                </tr>
                <tr>
                  <th>Population:</th>
                  <td>{this.state.country.population}</td>
                </tr>
                <tr>
                  <th>Language: </th>
                  <td>{this.state.country.languages[0].name}</td>
                </tr>
                <tr>
                  <th>Currencies: </th>
                  <td>
                    <ul className={"currencies"}>
                      {this.state.country.currencies.map(c => {
                        return c.name ? <li key={c.name}>{c.name}</li> : <li />;
                      })}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>Region:</th>
                  <td>{this.state.country.region}</td>
                </tr>
                <tr>
                  <th>Current Time</th>
                  <td>{this.renderCurrentTime()}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <Link to={"/"} className={"go-back-link"}>
                      <ArrowBackIcon /> go back
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </React.Fragment>
    );
  }
}
