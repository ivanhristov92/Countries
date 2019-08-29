import React from "react";
import Autosuggest from "react-autosuggest";

export default class MyAutosuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState(
      {
        value: newValue
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }
      }
    );
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.props.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.props.getSuggestionValue}
        renderSuggestion={this.props.renderSuggestion}
        inputProps={{
          placeholder: this.props.placeholder || "",
          value,
          onChange: this.onChange
        }}
      />
    );
  }
}
