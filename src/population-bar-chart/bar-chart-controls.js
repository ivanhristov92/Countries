import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import BarChartPersistenceService from "../services/bar-chart-persistance-service";

export default class BarChartControls extends React.Component {
  constructor(props) {
    super(props);
    let persistedControlsState = BarChartPersistenceService.getPersistedBarChartControlsData();
    this.state = {
      rows: persistedControlsState || []
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.rows !== prevState.rows) {
      BarChartPersistenceService.persistBarChartControlsData(this.state.rows);

      let selectedCountryNames = this.state.rows
        .filter(row => row.country)
        .map(r => r.country);
      let selectedCountries = this.props.allCountries.filter(country => {
        return selectedCountryNames.indexOf(country.name) !== -1;
      });
      this.props.onCountrySelected(selectedCountries);
    }
  }

  /**
   * Control Rows
   */
  addControlsRow = () => {
    this.setState({
      rows: [
        ...this.state.rows,
        { id: BarChartPersistenceService.generateId() }
      ]
    });
  };

  removeControlsRow = rowId => {
    this.setState({
      rows: this.state.rows.filter(row => row.id !== rowId)
    });
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
    this.setState({
      rows: this.state.rows.map(r => {
        if (r.id === rowId) {
          return {
            ...r,
            country
          };
        }
        return r;
      })
    });
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
      <div className={"region-row"} key={row.id}>
        <select
          onChange={e => this.setRegionForControlsRow(row.id, e.target.value)}
          value={row.region}
        >
          <option value="" className={"suggestion"}>
            Select region
          </option>
          {(this.props.allRegions || []).map(region => (
            <option
              className={"suggestion"}
              value={region}
              key={region + row.id}
            >
              {region}
            </option>
          ))}
        </select>

        <select
          onChange={e => this.setCountryForControlsRow(row.id, e.target.value)}
          value={row.country}
        >
          <option value="" className={"suggestion"}>
            Select country
          </option>
          {this.getCountriesFromRegion(row.region).map(country => (
            <option value={country.name} key={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        <IconButton
          aria-label="delete"
          onClick={() => this.removeControlsRow(row.id)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    ));
  };

  render() {
    let rows = this.renderRows();
    return (
      <div className={"bar-chart-controls"}>
        {rows}

        <div className={"add-row-button-container"}>
          {!rows.length && (
            <React.Fragment>
              <span className={"click-to-add-a-row"}>Click to add a row</span>
              <Fab
                color="primary"
                aria-label="add"
                onClick={this.addControlsRow}
              >
                <AddIcon />
              </Fab>
            </React.Fragment>
          )}
          {!!rows.length && (
            <Fab color="primary" aria-label="add" onClick={this.addControlsRow}>
              <AddIcon />
            </Fab>
          )}
        </div>
      </div>
    );
  }
}
