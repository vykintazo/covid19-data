import urllib.request, json
import pandas as pd


def prepare_sources():
    # Prepare Lithuanian data
    with urllib.request.urlopen("https://services3.arcgis.com/MF53hRPmwfLccHCj/ArcGIS/rest/services"
                                "/COVID19_statistika_dashboards/FeatureServer/0/query?where=municipality_name%3D"
                                "%27Lietuva%27&objectIds=&time=&resultType=none&outFields=active_de_jure"
                                "%2Ccumulative_totals%2Crecovered_de_jure%2Cdead_cases%2Cdate&returnIdsOnly=false"
                                "&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false"
                                "&cacheHint=false&orderByFields=date+DESC&groupByFieldsForStatistics=&outStatistics"
                                "=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token=") \
            as url:
        data = json.loads(url.read().decode())
        features = [i['attributes'] for i in data['features']]
        df_sam = pd.DataFrame(features)
        # df_sam = df_sam.drop(["OBJECTID", "DIENOS"], axis=1)
        df_sam.columns = ["Infected", "Confirmed", "Recovered", "Died", "Date"]
        df_sam.Date = pd.to_datetime(df_sam.Date, unit="ms")
        df_sam.index = df_sam.Date
        df_sam.index.name = 'dateIndex'
        df_sam_daily = df_sam.sort_index().asfreq(freq="D", method="pad")
        print(df_sam_daily.tail(2))
        # Prepare global data
        df_confirmed = pd.read_csv(
            "https://github.com/CSSEGISandData/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series"
            "/time_series_covid19_confirmed_global.csv")
        df_recovered = pd.read_csv(
            "https://github.com/CSSEGISandData/COVID-19/raw/master/csse_covid_19_data/csse_covid_19_time_series"
            "/time_series_covid19_recovered_global.csv")
        df_fatalities = pd.read_csv(
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data"
            "/csse_covid_19_time_series/time_series_covid19_deaths_global.csv")
        df_confirmed.drop(["Lat", "Long"], axis=1, inplace=True)
        df_confirmed = df_confirmed.melt(id_vars=["Province/State", "Country/Region"],
                                         var_name="Date",
                                         value_name="Confirmed")
        df_fatalities.drop(["Lat", "Long"], axis=1, inplace=True)
        df_fatalities = df_fatalities.melt(id_vars=["Province/State", "Country/Region"],
                                           var_name="Date",
                                           value_name="Died")
        df_recovered.drop(["Lat", "Long"], axis=1, inplace=True)
        df_recovered = df_recovered.melt(id_vars=["Province/State", "Country/Region"],
                                         var_name="Date",
                                         value_name="Recovered")
        df_t = pd.merge(df_confirmed, df_fatalities, how="outer", on=["Province/State", "Country/Region", "Date"])
        df_csse = pd.merge(df_t, df_recovered, how="outer", on=["Province/State", "Country/Region", "Date"])
        df_csse["Date"] = pd.to_datetime(df_csse["Date"])

        # Merge Provinces
        df_grouped = df_csse.groupby(["Date", "Country/Region"], as_index=False).sum()
        df_grouped["Infected"] = df_grouped["Confirmed"] - (df_grouped["Recovered"] + df_grouped["Died"])
        df_grouped.columns = ["Date", "Country", "Confirmed", "Died", "Recovered", "Infected"]
        return df_grouped, df_sam_daily
