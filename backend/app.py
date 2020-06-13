from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api
import json

from SIR import get_sir
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
            obj = {"description": df_csse.describe().to_dict(), 'countries': df_csse["Country"].unique().tolist()}
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
                return json.loads(
                    df_sam[["Date", "Confirmed", "Recovered", "Died", "Infected"]].to_json(orient='table', index=False))
            return json.loads(df_sam[t.capitalize()].to_json(orient='table'))
        except Exception as e:
            print(e)
            return "", 400


class GetCSEEData(Resource):
    def get(self, country, t):
        try:
            if t == "all":
                return json.loads(df_csse.loc[df_csse.Country == country.capitalize()][
                                      ['Date', 'Confirmed', 'Recovered', 'Died', 'Infected']].to_json(orient='table',
                                                                                                      index=False))
            return json.loads(df_csse[['Date', t.capitalize()]].to_json(orient='table', index=False))
        except:
            return "", 400


class GetSIRPredictions(Resource):
    def get(self, country, src):
        try:
            if src == "sam":
                df = df_sam
            elif src == "csse":
                df = df_csse.loc[df_csse.Country == country.capitalize()]
            else:
                return "", 400
            popt, pcov, fitted, popul = get_sir(df, country)
            schema = {"fields": [
                {"name": "popt", "type": "number[]"},
                {"name": "pocov", "type": "number[][]"},
                {"name": "fitted", "type": "number[]"},
                {"name": "population", "type": "number"}],
                "data": [{"popt": popt.tolist(), "pcov": pcov.tolist(), "fitted": fitted.tolist(), "population": popul}]
            }
            print(schema)
            return schema


        except Exception as e:
            print(e)
            return "", 400


api.add_resource(HelloWorld, '/')
api.add_resource(Sources, "/sources/")
api.add_resource(GetSource, "/sources/<string:src>")
api.add_resource(GetSamData, "/sources/sam/data/lithuania/<string:t>")
api.add_resource(GetCSEEData, "/sources/csse/data/<string:country>/<string:t>")
api.add_resource(GetSIRPredictions, "/sources/<string:src>/sir/<string:country>")


if __name__ == '__main__':
    prepare_sources()
    app.run(host="0.0.0.0")
