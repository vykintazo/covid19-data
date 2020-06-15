from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import json
import numpy as np
from pandas import DataFrame
from ARIMA import get_arima
from SIR import get_sir, SIR
from utils import prepare_sources

app = Flask(__name__)
api = Api(app)
CORS(app)

df_csse, df_sam = prepare_sources()

parser = reqparse.RequestParser()
parser.add_argument('beta', type=float)
parser.add_argument('gamma', type=float)
parser.add_argument('population', type=int)
parser.add_argument('s0', type=int)
parser.add_argument('i0', type=int)
parser.add_argument('r0', type=int)
parser.add_argument('days', type=int)




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
            return json.loads(df_sam[t.title()].to_json(orient='table'))
        except Exception as e:
            print(e)
            return "", 400


class GetCSEEData(Resource):
    def get(self, country, t):
        try:
            if t == "all":
                return json.loads(df_csse.loc[df_csse.Country == country.title()][
                                      ['Date', 'Confirmed', 'Recovered', 'Died', 'Infected']].to_json(orient='table',
                                                                                                      index=False))
            return json.loads(df_csse[['Date', t.title()]].to_json(orient='table', index=False))
        except:
            return "", 400


class GetSIRPredictions(Resource):
    def get(self, country, src):
        try:
            if src == "sam":
                df = df_sam[['Date', 'Confirmed', 'Recovered', 'Died', 'Infected']]
            elif src == "csse":
                df = df_csse.loc[df_csse.Country == country.title()][['Date', 'Confirmed', 'Recovered', 'Died', 'Infected']]
            else:
                return "", 400
            popt, pcov, fitted, popul, idx = get_sir(df, country)
            fitted = np.pad(fitted, ((0, 0), (idx, 0)))
            print(len(fitted[0]))
            print(len(df["Confirmed"]))
            df["sirSusceptable"] = fitted[0]
            df["sirInfected"] = fitted[1]
            df["sirRemoved"] = fitted[2]
            resp = json.loads(df.to_json(orient='table', index=False))
            resp["additional"] = {"fields": [
                {"name": "popt", "type": "number[]"},
                {"name": "err", "type": "number[][]"},
                {"name": "population", "type": "number"}],
                "data": {"popt": popt.tolist(), "err": np.sqrt(np.diag(pcov)).tolist(), "population": popul}
            }

            return resp

        except Exception as e:
            print(e)
            return e.__dict__, 400


class GetARIMAPredictions(Resource):
    def get(self, country, src, periods):
        try:
            if src == "sam":
                df = df_sam[['Date', 'Confirmed', 'Recovered', 'Died', 'Infected']]
            elif src == "csse":
                df = df_csse.loc[df_csse.Country == country.title()][['Date', 'Confirmed', 'Recovered', 'Died', 'Infected']]
            else:
                return "", 400

            df_pred, confint, summ = get_arima(df, periods)
            resp = json.loads(df_pred.to_json(orient='table', index=False))
            resp["additional"] = {"fields": [
                {"name": "confidence_int", "type": "number[]"},
                {"name": "summary", "type": "string"}],
                "data": {"confidence_int": confint.tolist(), "summary": summ.as_text()}
            }

            return resp

        except Exception as e:
            print(e)
            return e.__dict__, 400


class GetSIR(Resource):
    def post(self):
        try:
            args = parser.parse_args()
            print(args)
            preds = SIR(args['population'], args['beta'], args['gamma'], np.arange(0, args['days']), args['s0'], args['i0'], args['r0'])
            df = DataFrame(preds.T, columns=["Susceptible", "Infected", "Removed"])
            df["Day"] = [i for i in range(len(preds[0]))]
            return json.loads(df[["Day", "Susceptible", "Infected", "Removed"]].to_json(orient='table', index=False))
        except Exception as e:
            print(e)
            return e, 400


api.add_resource(HelloWorld, '/')
api.add_resource(Sources, "/sources/")
api.add_resource(GetSource, "/sources/<string:src>")
api.add_resource(GetSamData, "/sources/sam/data/lithuania/<string:t>")
api.add_resource(GetCSEEData, "/sources/csse/data/<string:country>/<string:t>")
api.add_resource(GetSIRPredictions, "/sources/<string:src>/sir/<string:country>")
api.add_resource(GetARIMAPredictions, "/sources/<string:src>/arima/<string:country>/<int:periods>")
api.add_resource(GetSIR, "/sir")


if __name__ == '__main__':
    prepare_sources()
    app.run(host="0.0.0.0")
