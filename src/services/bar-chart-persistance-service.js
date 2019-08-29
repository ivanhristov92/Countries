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

function generateId() {
  let ID_KEY = "uniqueId";
  let lastId = Number(localStorage.getItem(ID_KEY));
  if (!isNaN(lastId)) {
    let newId = lastId + 1;
    localStorage.setItem(ID_KEY, newId);
    return newId;
  } else {
    let newId = "0";
    localStorage.setItem(ID_KEY, newId);
    return newId;
  }
}

export default {
  persistBarChartData,
  getPersistedBarChartData,
  persistBarChartControlsData,
  getPersistedBarChartControlsData,
  generateId
};
