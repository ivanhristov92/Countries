import CountriesService from "./services/countries-service";
import PaginationControls from "./country-list/pagination-controls";
import React, { Component } from "react";
import BarChartWithControls from "./population-bar-chart/population-bar-chart";
import CountryList, { utils } from "./country-list/country-list-component";
import applyCountryFilters from "./country-list/country-filtering";
import applyCountrySorting from "./country-list/country-sorting";
import applyPagination from "./country-list/apply-pagination";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // shared component state
      allCountries: [],

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
        allRegions: utils.extractRegions(response.allCountries)
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
    this.setState(
      {
        selectedFilters: {
          ...this.state.selectedFilters,
          name
        }
      },
      this.returnToFirstPage
    );
  };

  setLanguageFilter = language => {
    this.setState(
      {
        selectedFilters: {
          ...this.state.selectedFilters,
          language
        }
      },
      this.returnToFirstPage
    );
  };
  setCurrencyFilter = currency => {
    this.setState(
      {
        selectedFilters: {
          ...this.state.selectedFilters,
          currency
        }
      },
      this.returnToFirstPage
    );
  };

  setPopulationFilter = population => {
    this.setState(
      {
        selectedFilters: {
          ...this.state.selectedFilters,
          population
        }
      },
      this.returnToFirstPage
    );
  };

  /**
   * Pagination
   */

  setPageNumber = changeTo => {
    console.log("changeto", changeTo);
    this.setState({
      pagination: {
        ...this.state.pagination,
        currentPage: changeTo
      }
    });
  };

  returnToFirstPage = () => {
    this.setPageNumber(1);
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

  render() {
    /**
     * Filter And Sort Countries
     */
    let filteredCountries = applyCountryFilters(
      this.state.allCountries,
      this.state.selectedFilters
    );
    let sortedCountries = applyCountrySorting(
      filteredCountries,
      this.state.sortBy
    );
    /**
     * Paginate the list of countries
     */
    let { resultsPerPage, currentPage } = this.state.pagination;
    let paginatedCountries = applyPagination(
      resultsPerPage,
      currentPage,
      sortedCountries
    );

    return (
      <div className="App">
        <PaginationControls
          currentPage={this.state.pagination.currentPage}
          navigateToPage={this.setPageNumber}
          resultsPerPage={this.state.pagination.resultsPerPage}
          setResultsPerPage={this.setResultsPerPage}
          numberOfPages={Math.ceil(
            sortedCountries.length / this.state.pagination.resultsPerPage
          )}
        />

        <CountryList
          allCountries={this.state.allCountries}
          // filter setters
          setNameFilter={this.setNameFilter}
          setPopulationFilter={this.setPopulationFilter}
          setLanguageFilter={this.setLanguageFilter}
          setCurrencyFilter={this.setCurrencyFilter}
          setNameSortType={this.setNameSortType}
          setPopulationSortType={this.setPopulationSortType}
          populationSortType={this.populationSortType}
          nameSortType={this.nameSortType}
          // filtered countries -- rename it
          paginatedCountries={paginatedCountries}
        />

        <div className={"bar-chart-and-controls-container"}>
          <BarChartWithControls
            allRegions={this.state.allRegions}
            allCountries={this.state.allCountries}
          />
        </div>
      </div>
    );
  }
}
