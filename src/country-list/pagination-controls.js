import React, { Component } from "react";

export default class PaginationControls extends Component {
  render() {
    let { currentPage, numberOfPages, navigateToPage } = this.props;
    return (
      <div className={"pagination-controls"}>
        <span>Results per page</span>
        <input
          type="number"
          placeholder={"Currently showing all"}
          onChange={e => this.props.setResultsPerPage(e.target.value)}
        />
        {this.props.resultsPerPage > 0 && (
          <div className={"pagination-controls_total-pages"}>
            <span>Page</span>
            <input
              value={currentPage}
              max={numberOfPages}
              min={0}
              type="number"
              onChange={e => navigateToPage(e.target.value)}
            />
            <span> / {numberOfPages}</span>
          </div>
        )}
      </div>
    );
  }
}
