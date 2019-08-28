import React, { Component } from "react";

export default class PaginationControls extends Component {
  render() {
    let { currentPage, numberOfPages, navigateToPage } = this.props;
    return (
      <React.Fragment>
        <input
          value={currentPage}
          max={numberOfPages}
          min={0}
          type="number"
          onChange={e => navigateToPage(e.target.value)}
        />
        <span> / {numberOfPages}</span>)
      </React.Fragment>
    );
  }
}
