import sa from "superagent";

const fetchAllCountries = () =>
  sa
    .get(
      `https://restcountries.eu/rest/v2/all?fields=flag;name;population;languages;currencies;region`
    )
    .then(response => {
      let allCountries = response.body;
      let allCurrencies = allCountries.reduce((acc, country) => {
        return acc.concat(country.currencies);
      }, []);
      let allNames = allCountries.map(country => {
        return country.name;
      });
      let allLanguages = allCountries.reduce((acc, country) => {
        return acc.concat(country.languages);
      }, []);
      let allPopulationNumbers = allCountries.map(country => country.population)
        .sort;

      let allRegions = allCountries.map(country => country.region);

      return {
        allCountries,
        allCurrencies,
        allNames,
        allLanguages,
        allRegions,
        allPopulationNumbers: {
          min: allPopulationNumbers[0],
          max: allPopulationNumbers[allPopulationNumbers.length - 1]
        }
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
