export function generateStops(cases, geojsonData) {
  const data = geojsonData?.data.features;

  let min = Infinity;
  let max = -Infinity;
  let sortedValues = [];

  data?.forEach((feature) => {
    const value = feature.properties[cases];
    sortedValues.push(value);
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  });

  sortedValues.sort(function (a, b) {
    return a - b;
  });

  let index80 = Math.floor(sortedValues.length * 0.8);
  let value80 = sortedValues[index80];

  const stops = [
    [min, '#FFEDA0'],
    [min + (value80 - min) / 5, '#FED976'],
    [min + ((value80 - min) * 2) / 5, '#FEB24C'],
    [min + ((value80 - min) * 3) / 5, '#FD8D3C'],
    [min + ((value80 - min) * 4) / 5, '#E31A1C'],
    [value80, '#BD0026'],
    [max, '#800026'],
  ];

  // console.log(stops);

  return stops;
}

/** 
 * export function generateStops(cases, geojsonData) {
  const data = geojsonData?.data.features;

  let min = Infinity;
  let max = -Infinity;

  data?.forEach((feature) => {
    const value = feature.properties[cases];
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  });

  const stops = [
    [min, '#FFEDA0'],
    [min + (max - min) / 6, '#FED976'],
    [min + ((max - min) * 2) / 6, '#FEB24C'],
    [min + ((max - min) * 3) / 6, '#FD8D3C'],
    [min + ((max - min) * 4) / 6, '#E31A1C'],
    [min + ((max - min) * 5) / 6, '#BD0026'],
    [max, '#800026'],
  ];

  // console.log(stops);

  return stops;
}
*/
