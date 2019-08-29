import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";

import BarChartPersistenceService from "../services/bar-chart-persistance-service";
import BarChartControls from "./bar-chart-controls";

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
            population: singleCountryData.population
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
        <h2 className={"population-barchart"}>Population Bar Chart</h2>

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
          <Tooltip />
          <Legend />
          <Bar dataKey="population" fill="#82ca9d" />
        </BarChart>
      </React.Fragment>
    );
  }
}
