const BAR_CHART_DATA_KEY = "persistedBarChartData";
const BAR_CHART_CONTROLS_DATA_KEY = "persistedBarChartControlsData";

function persistBarChartData(data) {
  return localStorage.setItem(BAR_CHART_DATA_KEY, JSON.stringify(data));
}
function getPersistedBarChartData() {
  let data = localStorage.getItem(BAR_CHART_DATA_KEY);
  return data && JSON.parse(data);
}
function persistBarChartControlsData(data) {
  return localStorage.setItem(
    BAR_CHART_CONTROLS_DATA_KEY,
    JSON.stringify(data)
  );
}
function getPersistedBarChartControlsData() {
  let data = localStorage.getItem(BAR_CHART_CONTROLS_DATA_KEY);
  return data && JSON.parse(data);
}

export default {
  persistBarChartData,
  getPersistedBarChartData,
  persistBarChartControlsData,
  getPersistedBarChartControlsData
};
