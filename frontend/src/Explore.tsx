import React, {useEffect, useState} from "react";
import {Card, Col, Row, Typography} from "antd";
import RechartsChart from "./RechartsChart";
import {DataSchema} from "./types";
import DataSelector from "./DataSelector";

export default function Explore() {

    const srcs = [{val: "sam", name: "Lithuanian Ministry of Health"}, {
        val: "csse",
        name: "Center for Systems Science and Engineering at JHU"
    }]
    const [data, setData] = useState<DataSchema | undefined>(undefined)
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
        fetch(`https://api.electo.lt/covid/sources/${src}/data/${country.toLowerCase()}/all`)
            .then((res: Response) => res.json())
            .then((data) => {
                console.log(data);
                setData(data);
            });
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
                        Explore COVID-19 stats.
                    </Typography.Title>
                </Col>
            </Row>
            <DataSelector handleSrcChange={handleSrcChange} handleCountryChange={handleCountryChange} srcs={srcs}
                          countries={countries}/>
            <Card style={{margin: "32px"}}>
                {data &&
                <RechartsChart data={data}/>
                }
            </Card>
        </div>
    )
}