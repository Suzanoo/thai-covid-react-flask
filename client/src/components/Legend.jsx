// Legend component
const Legend = (props) => {
  const stops = props.stops;
  // console.log(stops);
  return (
    <div className="map-overlay" id="legend">
      {stops.map(([value, color], i) => (
        <div key={i} className="legend-item">
          <span
            className="legend-key"
            style={{ backgroundColor: color }}
          ></span>
          <span className="legend-value">
            {i === 0
              ? `${Math.floor(value)} - ${Math.floor(stops[i + 1][0])}`
              : `${Math.floor(value)}+`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
