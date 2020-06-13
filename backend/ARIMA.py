from pmdarima import auto_arima


def get_arima(data, n_periods):
    model = auto_arima(data, start_p=1, start_q=1,
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
    summary = model.summary()
