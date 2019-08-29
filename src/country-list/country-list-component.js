import React, { Component } from "react";
import Autosuggest from "../common-components/autosuggest";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { uniq, uniqBy } from "ramda";

export const utils = {
  extractCurrencies(allCountries) {
    return allCountries.reduce((acc, country) => {
      return acc.concat(country.currencies);
    }, []);
  },
  extractNames(allCountries) {
    let names = allCountries.map(country => {
      return country.name;
    });

    return uniq(names);
  },
  extractLanguages(allCountries) {
    let languages = allCountries.reduce((acc, country) => {
      return acc.concat(country.languages);
    }, []);
    return uniq(languages);
  },
  extractPopulationNumbers(allCountries) {
    return allCountries.map(country => country.population).sort;
  },
  extractRegions(allCountries) {
    let regions = allCountries.map(country => country.region);
    return uniq(regions);
  }
};

export default class CountryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCurrencies: [],
      allNames: [],
      allLanguages: [],
      allPopulationNumbers: {
        min: 0,
        max: 0
      }
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allCountries !== this.props.allCountries) {
      let { allCountries } = this.props;
      let allPopulationNumbers = utils.extractPopulationNumbers(allCountries);
      this.setState({
        allNames: utils.extractNames(allCountries),
        allCurrencies: utils.extractCurrencies(allCountries),
        allLanguages: utils.extractLanguages(allCountries),
        allPopulationNumbers: {
          max: allPopulationNumbers[0],
          min: allPopulationNumbers[allPopulationNumbers.length - 1]
        }
      });
    }
  }

  getFilterSuggestions_Languages = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) return [];
    let results = this.state.allLanguages.filter(language => {
      if (!language || !language.name) return false;
      return language.name.toLowerCase().slice(0, inputLength) === inputValue;
    });

    return uniq(results);
  };

  getFilterSuggestions_Currencies = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) return [];
    let results = this.state.allCurrencies.filter(currency => {
      if (!currency || !currency.name) return false;
      return currency.name.toLowerCase().slice(0, inputLength) === inputValue;
    });
    return uniq(results);
  };

  getFilterSuggestions_Names = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0) return [];
    return this.state.allNames.filter(
      lang => lang.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  render() {
    let { props } = this;

    return (
      <div className={"country-list-container"}>
        <table className={"country-list"}>
          <thead>
            <tr>
              <th>Flag</th>
              <th>
                Name{" "}
                {props.nameSortType === "asc" ? (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={props.setNameSortType}
                  >
                    <ArrowDownwardIcon fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={props.setNameSortType}
                  >
                    <ArrowUpwardIcon fontSize="inherit" />
                  </IconButton>
                )}
              </th>
              <th>
                Population{" "}
                {props.populationSortType === "asc" ? (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={props.setPopulationSortType}
                  >
                    <ArrowDownwardIcon fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={props.setPopulationSortType}
                  >
                    <ArrowUpwardIcon fontSize="inherit" />
                  </IconButton>
                )}
              </th>
              <th>Main Language</th>
              <th>Main Currency</th>
            </tr>
            <tr>
              <th />
              <th>
                <Autosuggest
                  originalList={this.state.allNames}
                  getSuggestionValue={a => a}
                  renderSuggestion={suggestion => (
                    <div className={"suggestion"}>{suggestion}</div>
                  )}
                  getSuggestions={this.getFilterSuggestions_Names}
                  onChange={props.setNameFilter}
                />
              </th>
              <th>
                <input
                  type="number"
                  name="population"
                  onChange={e =>
                    props.setPopulationFilter(Number(e.target.value))
                  }
                  min={this.state.allPopulationNumbers.min}
                  max={this.state.allPopulationNumbers.max}
                />
              </th>
              <th>
                <Autosuggest
                  originalList={this.state.allLanguages}
                  getSuggestionValue={language => language.name}
                  renderSuggestion={language => (
                    <div className={"suggestion"}>
                      {language.name} {language.iso639_1}
                    </div>
                  )}
                  getSuggestions={this.getFilterSuggestions_Languages}
                  onChange={props.setLanguageFilter}
                />
              </th>
              <th>
                <Autosuggest
                  originalList={this.state.allCurrencies}
                  getSuggestionValue={currency => currency.name}
                  renderSuggestion={suggestion => (
                    <div className={"suggestion"}>
                      {suggestion.symbol} {suggestion.name} {suggestion.code}
                    </div>
                  )}
                  getSuggestions={this.getFilterSuggestions_Currencies}
                  onChange={props.setCurrencyFilter}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {props.paginatedCountries.map(country => {
              return (
                <tr key={country.name}>
                  <td>
                    <img src={country.flag} width={100} />
                  </td>
                  <td>
                    <Link to={`/country/${country.name}`}>{country.name}</Link>
                  </td>

                  <td>{country.population}</td>
                  <td>{(country.languages[0] || []).name}</td>
                  <td>{(country.currencies[0] || []).name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
