import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import Map from '../components/Map';
import Sidenav from '../components/Sidenav';
import dataService from '../features/dataService/dataService';
import { generateStops } from '../utils/createStops';

function Home() {
  const [geojsonData, setGeojsonData] = useState(null);
  const { queryData, isError, message } = useSelector(
    (state) => state.queryData
  );
  const [stops, setStops] = useState([
    [0, '#FFEDA0'],
    [5000, '#FED976'],
    [10000, '#FEB24C'],
    [20000, '#FD8D3C'],
    [50000, '#E31A1C'],
    [100000, '#BD0026'],
    [200000, '#800026'],
  ]);

  useEffect(() => {
    const fetchData = async (date) => {
      try {
        const response = await dataService.fetchCovidData(date);
        setGeojsonData(response.data);
        // console.log('Fetch new json data', response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isError) {
      toast.error(message);
    }
    if (queryData) fetchData(queryData.date);

    // console.log('New query', JSON.stringify(queryData));
  }, [queryData, isError, message]);

  useEffect(() => {
    if (geojsonData) {
      const newStops = generateStops(queryData.cases, geojsonData);
      setStops(newStops);
    }
  }, [geojsonData, queryData]);

  return (
    <>
      <div className="grid-container">
        <header className="header">
          <div className="header__search">
            Thailand Covid-19 Pandamic :
            <span style={{ color: 'orange' }}>{queryData.date}</span>
          </div>
          <div className="header__avatar">Avatar</div>
        </header>

        {geojsonData && <Sidenav />}

        <main className="main">
          <div className="main-overview">
            <div
              className="overviewcard"
              style={{ backgroundColor: '#088634' }}
            >
              New case: {geojsonData && geojsonData.stat.NEW_CASE}
            </div>
            <div className="overviewcard" style={{ backgroundColor: 'orange' }}>
              New death: {geojsonData && geojsonData.stat.NEW_DEATH}
            </div>
            <div
              className="overviewcard"
              style={{ backgroundColor: '#079ba2' }}
            >
              Total case: {geojsonData && geojsonData.stat.TOTAL_CASE}
            </div>
            <div
              className="overviewcard"
              style={{ backgroundColor: '#ac4c69' }}
            >
              Total death: {geojsonData && geojsonData.stat.TOTAL_DEATH}
            </div>
          </div>
          <div className="main-cards">
            <div className="card">
              {geojsonData && geojsonData ? (
                <Map
                  stops={stops}
                  property={queryData.cases}
                  data={geojsonData.data}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
          <div style={{ color: '#646363' }}>
            <ul>
              <li>
                <Link to="https://covid19.ddc.moph.go.th">
                  Sourec: Thailand Department of Disease Control update on
                  2022-12-25.
                </Link>
              </li>
            </ul>
          </div>
        </main>
        <footer className="footer">
          <div className="footer__copyright">&copy; 2023 MTH</div>
          <div className="footer__signature">
            I tried and failed, I tried again and again.
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
