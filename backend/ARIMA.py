from pmdarima import auto_arima
import numpy as np
import pandas as pd


def get_arima(data, n_periods):
    data = data[["Date", "Confirmed"]]
    d = [i for i in data.Confirmed]
    model = auto_arima(d, start_p=1, start_q=1,
                          test='kpss',
                          max_p=3, max_q=3,
                          m=1,
                          d=None,
                          seasonal=False,
                          start_P=0,
                          D=0,
                          trace=True,
                          error_action='ignore',
                          suppress_warnings=True,
                          stepwise=True)
    fc, confint = model.predict(n_periods=n_periods, return_conf_int=True)
    last_date = data['Date'].iloc[-1].to_datetime64()
    rng = np.arange(last_date + + np.timedelta64(1, 'D'), last_date + np.timedelta64(n_periods + 1, 'D'),
                    dtype='datetime64[D]')
    df_arima = pd.DataFrame({"Date": rng, "predConfirmed": fc})
    df_concat = pd.concat([data, df_arima], ignore_index=True)
    summary = model.summary()
    return df_concat, confint, summary
