from scipy.integrate import solve_ivp
from scipy.optimize import curve_fit
from numpy import nonzero
import requests


def sir_odes(t, x, beta, gamma, n):
    s, i, r = x
    dsdt = - beta * s * i / n
    didt = beta * s * i / n - gamma * i
    drdt = gamma * i
    return [dsdt, didt, drdt]


def SIR(N, beta, gamma, t, s0, i0, r0):
    res = solve_ivp(sir_odes, (t[0], t[-1]), [s0, i0, r0], args=[beta, gamma, N], t_eval=t)
    return res.y


population = float(0)
i0 = 0


def fit_sir(x, beta, gamma):
    r0 = float(0)
    s0 = population - i0
    # return only infected
    return SIR(population, beta, gamma, x, s0, i0, r0)[1]


def fit_sir_full(x, beta, gamma):
    r0 = float(0)
    s0 = population - i0
    # return all
    return SIR(population, beta, gamma, x, s0, i0, r0)


def get_sir(df_country, country):
    global population, i0
    y = df_country.Infected.to_numpy()
    first_case_idx = nonzero(y)[0][0]
    i0 = y[first_case_idx]
    y = y[first_case_idx:]
    x = [i for i in range(len(y))]

    r = requests.get("https://restcountries.eu/rest/v2/name/{}?fields=population".format(country.lower()))
    print(r.json()[0])
    population = float(r.json()[0]['population'])
    popt, pcov = curve_fit(fit_sir, x, y, bounds=(0, 20))
    fitted = fit_sir_full(x, *popt)
    return popt, pcov, fitted, population, first_case_idx
