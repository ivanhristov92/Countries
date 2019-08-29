import sa from "superagent";

const fetchAllCountries = () =>
  sa
    .get(
      `https://restcountries.eu/rest/v2/all?fields=flag;name;population;languages;currencies;region`
    )
    .then(response => {
      let allCountries = response.body;

      return {
        allCountries
      };
    });

const fetchCountryByName = countryName => {
  return sa
    .get(`https://restcountries.eu/rest/v2/name/${countryName}`)
    .then(response => {
      return response.body[0];
    });
};

export default {
  fetchAllCountries,
  fetchCountryByName
};
