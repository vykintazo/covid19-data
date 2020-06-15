import React, {useEffect, useState} from "react";
import DataSelector from "./DataSelector";
import {Card, Col, Row, Typography} from "antd";
import RechartsChart from "./RechartsChart";
import {DataSchema} from "./types";
import SIRSelector from "./SIRSelector";


const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}


export default function SIR() {

    const srcs = [{val: "sam", name: "Lithuanian Ministry of Health"}, {
        val: "csse",
        name: "Center for Systems Science and Engineering at JHU"
    }]
    const [sirData, setSirData] = useState<DataSchema | undefined>(undefined)
    const [playData, setPlayData] = useState<DataSchema | undefined>(undefined)
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
            let res2 = await fetch(`https://api.electo.lt/covid/sources/${src}/sir/${country.toLowerCase()}`);
            let sir_data = await res2.json();
            console.log("SIR", sir_data);
            setSirData(sir_data);
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
    const onFinish = (values: any) => {
        console.log('Success:', values);
        postData("https://api.electo.lt/covid/sir", values).then(data => {
            console.log("data", data)
            setPlayData(data)
        })

    };


    return (
        <div>
            <Row>
                <Col span={24} style={{margin: 8}}>
                    <Typography.Title>
                        Fit SIR model with real data.
                    </Typography.Title>
                </Col>
            </Row>
            <DataSelector handleSrcChange={handleSrcChange} handleCountryChange={handleCountryChange} srcs={srcs}
                          countries={countries} population={sirData?.additional?.data.population}/>
            <Card style={{margin: "32px"}}>
                <RechartsChart data={sirData}/>
            </Card>
            <Row>
                <Col span={24} style={{margin: 8}}>
                    <Typography.Title>
                        SIR Playground.
                    </Typography.Title>
                </Col>
                <Row>
                    <Col span={24} style={{margin: 2}}>
                        <p>You can set all individual parameters to get SIR graph.</p>
                        <p>s0, i0, r0 are the initial values for Susceptible, Infected and Removed.</p>
                    </Col>
                </Row>
            </Row>
            <SIRSelector onFinish={onFinish}/>
            <Card style={{margin: "32px"}}>
                {playData &&
                <RechartsChart data={playData} playground/>
                }
            </Card>
        </div>
    )

}