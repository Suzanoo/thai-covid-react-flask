import os
import pandas as pd
import geopandas as gpd

province_data = pd.read_csv(os.getcwd() + '/server/src/data/province_daily.csv')
province_shape =  gpd.read_file(os.getcwd() + '/server/src/data/thai.geojson')
thai = pd.read_csv(os.getcwd() + '/server/src/data/thai_daily.csv')

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
    print(geojson)

    # data for value-box rendering
    df1 = thai[thai['date'] <= queryDate].copy()
    df1 = thai.iloc[-1].copy()   
    
    context = {
        'data': geojson,
        'NEW_CASE': int(df1.new_case),
        'TOTAL_CASE': int(df1.total_case),
        'NEW_DEATH': int(df1.new_death),
        'TOTAL_DEATH': int(df1.total_death)
    }
    return context

filter_data('2022-12-31')