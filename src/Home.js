import CountriesService from "./countries-service";
import PaginationControls from "./PaginationControls";
import Autosuggest from "./Autosuggest";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { uniq } from "ramda";

import React, { Component, PureComponent } from "react";
import "./App.css";
import BarChartWithControls from "./PopulationBarChart";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCountries: [],

      allCurrencies: [],
      allNames: [],
      allLanguages: [],
      allPopulationNumbers: {
        min: 0,
        max: 0
      },
      allRegions: [],

      selectedFilters: {
        name: "",
        currency: "",
        language: "",
        population: ""
      },

      pagination: {
        resultsPerPage: 0, //means all
        currentPage: 1 // first page
      },

      sortBy: []
    };
  }

  componentDidMount() {
    CountriesService.fetchAllCountries().then(response => {
      this.setState({
        allCountries: response.allCountries,
        allNames: response.allNames,
        allCurrencies: response.allCurrencies,
        allLanguages: response.allLanguages,
        allRegions: response.allRegions,
        allPopulationNumbers: {
          max: response.allPopulationNumbers.max,
          min: response.allPopulationNumbers.min
        }
      });
    });
  }

  /**
   * Filtering
   */
  /**
   * Filter Control Handlers
   */
  setNameFilter = name => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        name
      }
    });
  };

  setLanguageFilter = language => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        language
      }
    });
  };
  setCurrencyFilter = currency => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        currency
      }
    });
  };

  setPopulationFilter = population => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        population
      }
    });
  };

  _filterByName = (_countries, name) => {
    var options = {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name"]
    };
    var fuse = new Fuse(_countries, options);
    let result = fuse.search(name);
    return result;
  };

  _filterByLanguage = (_countries, language) => {
    return _countries.filter(country => {
      var options = {
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name"]
      };
      var fuse = new Fuse(country.languages, options);
      let result = fuse.search(language);
      return result.length > 0;
    });
  };
  _filterByCurrency = (_countries, currency) => {
    return _countries.filter(country => {
      var options = {
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name"]
      };
      var fuse = new Fuse(country.currencies, options);
      let result = fuse.search(currency);
      return result.length > 0;
    });
  };

  applyCountryFilters = () => {
    let _countries = [...this.state.allCountries];
    let { name, population, language, currency } = this.state.selectedFilters;
    if (name) {
      _countries = this._filterByName(_countries, name);
    }
    if (language) {
      _countries = this._filterByLanguage(_countries, language);
    }
    if (currency) {
      _countries = this._filterByCurrency(_countries, currency);
    }
    if (population) {
      _countries = _countries.filter(country => {
        return country.population === population;
      });
    }
    return _countries;
  };

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

  /**
   * Pagination
   */
  applyPaginationToCountryList = countriesList => {
    let { resultsPerPage, currentPage } = this.state.pagination;
    if (!resultsPerPage) return countriesList;

    let listItemsToShow = countriesList.slice(
      resultsPerPage * (currentPage - 1),
      resultsPerPage * (currentPage - 1) + resultsPerPage
    );
    return listItemsToShow;
  };
  setPageNumber = changeTo => {
    console.log("changeto", changeTo);
    this.setState({
      pagination: {
        ...this.state.pagination,
        currentPage: changeTo
      }
    });
  };

  setResultsPerPage = numberOfResults => {
    this.setState({
      pagination: {
        resultsPerPage: Number(numberOfResults),
        currentPage: 1
      }
    });
  };

  /**
   * Sorting
   */
  get nameSortType() {
    return (this.state.sortBy.find(sort => sort.by === "name") || {}).type;
  }

  get populationSortType() {
    return (this.state.sortBy.find(sort => sort.by === "population") || {})
      .type;
  }

  setPopulationSortType = () => {
    let currentSortByPopulation = this.populationSortType;
    if (!currentSortByPopulation) {
      return this.setState({
        sortBy: [...this.state.sortBy, { by: "population", type: "asc" }]
      });
    }
    let typeOfSort = currentSortByPopulation === "asc" ? "desc" : "asc";
    let newSortState = this.state.sortBy.filter(
      sort => sort.by !== "population"
    );
    newSortState = newSortState.concat([
      { by: "population", type: typeOfSort }
    ]);
    this.setState({
      sortBy: newSortState
    });
  };

  setNameSortType = () => {
    let currentSortByPopulation = this.nameSortType;
    if (!currentSortByPopulation) {
      return this.setState({
        sortBy: [...this.state.sortBy, { by: "name", type: "asc" }]
      });
    }
    let typeOfSort = currentSortByPopulation === "asc" ? "desc" : "asc";
    let newSortState = this.state.sortBy.filter(sort => sort.by !== "name");
    newSortState = newSortState.concat([{ by: "name", type: typeOfSort }]);
    this.setState({
      sortBy: newSortState
    });
  };

  _sortByPopulation(countries, sortType) {
    return countries.sort(
      (a, b) =>
        sortType === "asc"
          ? a.population - b.population
          : b.population - a.population
    );
  }

  _sortByName(countries, sortType) {
    return countries.sort((a, b) => {
      if (sortType === "asc") {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }
      if (sortType === "desc") {
        if (a.name < b.name) return 1;
        if (a.name > b.name) return -1;
        return 0;
      }
    });
  }

  applyCountrySorting = countries => {
    if (this.state.sortBy.length === 0) return countries;

    let _countries = [...countries];
    for (let i = 0; i < this.state.sortBy.length; i++) {
      let { by, type } = this.state.sortBy[i];
      if (by === "population") {
        _countries = this._sortByPopulation(_countries, type);
      } else if (by === "name") {
        _countries = this._sortByName(_countries, type);
      }
    }
    return _countries;
  };

  render() {
    /**
     * Filter And Sort Countries
     */
    let filteredCountries = this.applyCountryFilters();
    let sortedCountries = this.applyCountrySorting(filteredCountries);
    /**
     * Paginate the list of countries
     */
    let paginatedCountries = this.applyPaginationToCountryList(sortedCountries);
    /**
     * Control pagination state
     */
    let paginationControls = this.state.pagination.resultsPerPage > 0 && (
      <PaginationControls
        currentPage={this.state.pagination.currentPage}
        numberOfPages={Math.ceil(
          sortedCountries.length / this.state.pagination.resultsPerPage
        )}
        navigateToPage={this.setPageNumber}
      />
    );
    return (
      <div className="App">
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                <label htmlFor="resultsPerPage">Results Per Page</label>
                <input
                  type="number"
                  placeholder={"Currently showing all"}
                  onChange={e => this.setResultsPerPage(e.target.value)}
                />
                {paginationControls}
              </th>
            </tr>
            <tr>
              <th>Flag</th>
              <th>
                Name{" "}
                <button
                  style={{ display: "inline " }}
                  onClick={this.setNameSortType}
                >
                  sort {this.nameSortType}
                </button>
              </th>
              <th>
                Population{" "}
                <button
                  style={{ display: "inline " }}
                  onClick={this.setPopulationSortType}
                >
                  sort {this.populationSortType}
                </button>
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
                  renderSuggestion={suggestion => <div>{suggestion}</div>}
                  getSuggestions={this.getFilterSuggestions_Names}
                  onChange={this.setNameFilter}
                />
              </th>
              <th>
                <input
                  type="number"
                  name="population"
                  onChange={e =>
                    this.setPopulationFilter(Number(e.target.value))
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
                    <div>
                      {language.name} {language.iso639_1}
                    </div>
                  )}
                  getSuggestions={this.getFilterSuggestions_Languages}
                  onChange={this.setLanguageFilter}
                />
              </th>
              <th>
                <Autosuggest
                  originalList={this.state.allCurrencies}
                  getSuggestionValue={currency => currency.name}
                  renderSuggestion={suggestion => (
                    <div>
                      {suggestion.symbol} {suggestion.name} {suggestion.code}
                    </div>
                  )}
                  getSuggestions={this.getFilterSuggestions_Currencies}
                  onChange={this.setCurrencyFilter}
                />
              </th>
            </tr>
          </thead>
        </table>
        <div style={{ height: 300, overflow: "scroll" }}>
          <table>
            <tbody>
              {paginatedCountries.map(country => {
                return (
                  <tr>
                    <td>
                      <img src={country.flag} width={100} />
                    </td>
                    <td>
                      <Link to={`/country/${country.name}`}>
                        .{country.name}
                      </Link>
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

        <BarChartWithControls
          allRegions={this.state.allRegions}
          allCountries={this.state.allCountries}
        />
      </div>
    );
  }
}
