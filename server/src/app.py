import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import geopandas as gpd

app = Flask(__name__)
CORS(app)

# -----------------------------------------------
province_data = pd.read_csv(os.getcwd() + '/src/data/province_daily.csv')
province_shape =  gpd.read_file(os.getcwd() + '/src/data/thai.geojson')
thai = pd.read_csv(os.getcwd() + '/src/data/thai_daily.csv')

dates = pd.unique(province_data['date'].values)

def filter_data(queryDate=None):
    # config input date
    if queryDate not in dates:
        queryDate = dates[-1]

    # filter & perform the join
    df = province_data[province_data['date'] == queryDate].copy()
    df0 = df[['date', 'update', 'new_case', 'new_death', 'total_case', 'total_death', 'ADM1_EN']].copy()
    merge = pd.merge(province_shape, df0, on="ADM1_EN", how="left")

    # convert the pandas dataframe to a GeoDataFrame
    gdf = gpd.GeoDataFrame(merge, geometry='geometry')

    # convert to GeoJSON
    geojson = gdf.__geo_interface__

    # data for value-box rendering
    df1 = thai[thai['date'] <= queryDate].copy()
    df1 = df1.iloc[-1].copy()   

    context = {
        'data': geojson,
        'stat' : {
            'NEW_CASE': int(df1.new_case),
            'TOTAL_CASE': int(df1.total_case),
            'NEW_DEATH': int(df1.new_death),
            'TOTAL_DEATH': int(df1.total_death)
        }      
    }
    return context

# -----------------------------------------------
@app.route('/api/v1/covid', methods=['POST'])
def view_function1():
    try:
        date = request.json
        data = filter_data(date)
        return jsonify({
            'status': 'Success',
            'data': data
        })
    except KeyError:
        return jsonify({
            'status': 500,
            'error': 'queryDate missing'
            })
    except ValueError:
        return jsonify({
            'status': 500,
            'error': 'invalid queryDate'
            })
    except Exception as e:
        return jsonify({
            'status': 500,
            'error': str(e)
            })
    
print('Listening on port 5000')
        
    
# (dash) suzanoo@Suzanoo-MBP server % gunicorn --config gunicorn_config.py src.wsgi:application
