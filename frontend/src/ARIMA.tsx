import React, {useEffect, useState} from "react";
import DataSelector from "./DataSelector";
import {Card, Col, Collapse, Row, Typography} from "antd";
import {DataSchema} from "./types";
import ARIMAChart from "./ARIMAChart";


export default function ARIMA() {

    const srcs = [{val: "sam", name: "Lithuanian Ministry of Health"}, {
        val: "csse",
        name: "Center for Systems Science and Engineering at JHU"
    }]
    const [arimaData, setArimaData] = useState<DataSchema | undefined>(undefined)
    const [countries, setCountries] = useState<string[]>(["Lithuania"]);
    const [src, setSrc] = useState("sam")
    const [country, setCountry] = useState("Lithuania");


    useEffect(() => {
        fetch(`https://api.electo.lt/covid/sources/${src}`)
            .then((res: Response) => res.json())
            .then((data) => {
                setCountries(data.countries);
                console.log(data)
            });
    }, [src])
    useEffect(() => {
        const fetchStuff = async () => {
            let res2 = await fetch(`https://api.electo.lt/covid/sources/${src}/arima/${country.toLowerCase()}/20`);
            let sir_data = await res2.json();
            console.log("ARIMA", sir_data);
            setArimaData(sir_data);
        }
        fetchStuff();

    }, [src, country])

    const handleSrcChange = (val: string) => {
        console.log(val)
        setSrc(val)
    }
    const handleCountryChange = (val: string) => {
        console.log(val)
        setCountry(val)
    }


    return (
        <div>
            <Row>
                <Col span={24} style={{margin: 8}}>
                    <Typography.Title>
                        Fit ARIMA model with real data.
                    </Typography.Title>
                </Col>
            </Row>
            <DataSelector handleSrcChange={handleSrcChange} handleCountryChange={handleCountryChange} srcs={srcs}
                          countries={countries}/>
            <Card style={{margin: "32px"}}>
                <ARIMAChart data={arimaData}/>
            </Card>
            <Collapse>
                <Collapse.Panel header="Advanced info about this model" key="1" style={{textAlign: "center"}}>
                    <pre style={{textAlign: "center"}}>{arimaData?.additional?.data.summary}</pre>
                </Collapse.Panel>
            </Collapse>
        </div>
    )
}