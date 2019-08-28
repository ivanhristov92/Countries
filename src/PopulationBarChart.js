import React, { Component, PureComponent } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import BarChartPersistenceService from "./bar-chart-persistance-service";

class BarChartControls extends React.Component {
  constructor(props) {
    super(props);

    let persistedControlsState = BarChartPersistenceService.getPersistedBarChartControlsData();

    this.state = {
      rows: persistedControlsState || []
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    BarChartPersistenceService.persistBarChartControlsData(this.state.rows);
  }

  /**
   * Control Rows
   */
  addControlsRow = () => {
    this.setState({
      rows: [...this.state.rows, { id: rowId++ }]
    });
  };

  removeControlsRow = rowId => {
    this.setState(
      {
        rows: this.state.rows.filter(row => row.id !== rowId)
      },
      () => {
        let selectedCountryNames = this.state.rows
          .filter(row => row.country)
          .map(r => r.country);
        let selectedCountries = this.props.allCountries.filter(country => {
          return selectedCountryNames.indexOf(country.name) !== -1;
        });
        this.props.onCountrySelected(selectedCountries);
      }
    );
  };

  /**
   * Value Setters
   */
  setRegionForControlsRow(rowId, region) {
    this.setState({
      rows: this.state.rows.map(r => {
        if (r.id === rowId) {
          return {
            ...r,
            region
          };
        }
        return r;
      })
    });
  }

  setCountryForControlsRow = (rowId, country) => {
    this.setState(
      {
        rows: this.state.rows.map(r => {
          if (r.id === rowId) {
            return {
              ...r,
              country
            };
          }
          return r;
        })
      },
      () => {
        let selectedCountryNames = this.state.rows
          .filter(row => row.country)
          .map(r => r.country);
        let selectedCountries = this.props.allCountries.filter(country => {
          return selectedCountryNames.indexOf(country.name) !== -1;
        });
        this.props.onCountrySelected(selectedCountries);
      }
    );
  };

  getCountriesFromRegion = region => {
    if (!region) return [];
    return this.props.allCountries.filter(country => country.region === region);
  };

  /**
   * Rendering
   */
  renderRows = () => {
    return this.state.rows.map(row => (
      <div>
        <span>{row.id}</span>
        <select
          name="region"
          id="region"
          onChange={e => this.setRegionForControlsRow(row.id, e.target.value)}
        >
          <option value="" />
          {this.props.allRegions.map(region => (
            <option value={region}>{region}</option>
          ))}
        </select>

        <select
          name="country"
          id="country"
          onChange={e => this.setCountryForControlsRow(row.id, e.target.value)}
        >
          {this.getCountriesFromRegion(row.region).map(country => (
            <option value={country.name}>{country.name}</option>
          ))}
        </select>
        <button onClick={() => this.removeControlsRow(row.id)}>remove</button>
      </div>
    ));
  };

  render() {
    return (
      <div>
        {this.renderRows()}
        <button onClick={this.addControlsRow}>add new</button>
      </div>
    );
  }
}

let rowId = 0;

export default class BarChartWithControls extends PureComponent {
  constructor(props) {
    super(props);

    let preservedState = BarChartPersistenceService.getPersistedBarChartData();

    this.state = {
      data: preservedState || []
    };
  }

  handleSelectedCountriesChange = selectedCountries => {
    this.setState(
      {
        data: selectedCountries.map(singleCountryData => {
          return {
            name: singleCountryData.name,
            uv: singleCountryData.population,
            pv: 111,
            amt: 111
          };
        })
      },
      () => {
        BarChartPersistenceService.persistBarChartData(this.state.data);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <BarChartControls
          allRegions={this.props.allRegions}
          allCountries={this.props.allCountries}
          onCountrySelected={this.handleSelectedCountriesChange}
          onCountryRemoved={this.handleSelectedCountriesChange}
        />
        <BarChart
          width={500}
          height={300}
          data={this.state.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </React.Fragment>
    );
  }
}
