from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api
import urllib.request, json
import pandas as pd
import numpy as np
from iso3166 import countries
from utils import prepare_sources

app = Flask(__name__)
api = Api(app)
CORS(app)

df_csse, df_sam = prepare_sources()


class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}


class Sources(Resource):
    def get(self):
        return {'sources': ['csse', 'sam']}


class GetSource(Resource):
    def get(self, src):
        if src == "csse":
            obj = {"description": df_csse.describe().to_dict(), 'countries': df_csse["Country/Region"].unique().tolist()}
            return obj
        if src == "sam":
            obj = {"description": df_csse.describe().to_dict(), 'countries': ["Lithuania"]}
            return obj
        else:
            return "No such source found.", 404


class GetSamData(Resource):
    def get(self, t):
        try:
            if t == "all":
                return json.loads(df_sam[["Date", "Confirmed", "Recovered", "Died", "Infected"]].to_json(orient='table', index=False))
            return json.loads(df_sam[t.capitalize()].to_json(orient='table'))
        except Exception as e:
            print(e)
            return "", 400

class GetCSEEData(Resource):
    def get(self, country, t):
        try:
            df = df_csse.loc[df_csse["Country/Region"] == country.capitalize()]\
                .groupby(["Date", "Country/Region"], as_index=False)\
                .sum()
            if t == "all":
                return json.loads(df[['Date', 'Confirmed', 'Recovered', 'Died']].to_json(orient='table', index=False))
            return json.loads(df[['Date', t.capitalize()]].to_json(orient='table', index=False))
        except:
            return "", 400


api.add_resource(HelloWorld, '/')
api.add_resource(Sources, "/sources/")
api.add_resource(GetSource, "/sources/<string:src>")
api.add_resource(GetSamData, "/sources/sam/data/lithuania/<string:t>")
api.add_resource(GetCSEEData, "/sources/csse/data/<string:country>/<string:t>")


if __name__ == '__main__':
    prepare_sources()
    app.run()
