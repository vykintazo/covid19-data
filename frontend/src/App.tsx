import React, {useEffect, useState} from 'react';
import "antd/dist/antd.css";
import "./App.css"
import {Card, Col, Layout, Menu, Row, Select, Typography} from 'antd';
// import LineChart from "./LineChart";
import {DataSchema} from "./types";
import {Link, Route, Switch} from 'react-router-dom';
import logo from './icon_color.svg'
import RechartsChart from './RechartsChart';

const {Header, Footer, Content} = Layout;


function App() {
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
        <Layout className="layout">
            <Header>
                <div className="logo">
                   <img src={logo} alt={'Logo'} width={"50px"} style={{margin: "0 16px"}}/>
                   <span>Covid Data</span>
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <span>Explore</span>
                        <Link to={"/"}/>
                    </Menu.Item>
                    <Menu.SubMenu title="Forecasting">
                        <Menu.Item key="sir">
                            <span>SIR model</span>
                            <Link to={"/sir"}/>
                        </Menu.Item>
                        <Menu.Item key="arima">
                            <span>ARIMA model</span>
                            <Link to={"/arima"}/>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <div className="site-layout-content">
                    <Switch>
                        <Route exact path={"/"}>
                            <div>
                                <Row>
                                    <Col span={24} style={{margin: 8}}>
                                        <Typography.Title>
                                            Explore COVID-19 stats.
                                        </Typography.Title>
                                    </Col>
                                </Row>
                                <Card style={{margin: "0 32px"}}>
                                    <Row gutter={{xs: 8, lg: 32}}>
                                        <Col xs={24} lg={8} style={{margin: 8}}>
                                            <Select
                                                style={{width: "100%"}}
                                                defaultValue={"sam"}
                                                placeholder="Select data source"
                                                optionFilterProp="children"
                                                onChange={handleSrcChange}
                                            >
                                                {srcs.map((value, i) => <Select.Option key={`country-${i}`}
                                                                                       value={value.val}>{value.name}</Select.Option>)}
                                            </Select>
                                        </Col>
                                        <Col xs={24} lg={8} style={{margin: 8}}>
                                            <Select
                                                showSearch
                                                style={{width: "100%"}}
                                                placeholder="Select country"
                                                optionFilterProp="children"
                                                defaultValue={"lithuania"}
                                                onChange={handleCountryChange}
                                                filterOption={(input, option) =>
                                                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {countries.map((value, i) => <Select.Option key={`country-${i}`}
                                                                                            value={value.toLowerCase()}>{value}</Select.Option>)}
                                            </Select> </Col>
                                    </Row>
                                </Card>
                                <Card style={{margin: "32px"}}>
                                    {data?.data &&
                                        <RechartsChart data={data}/>
                                    }
                                </Card>
                            </div>
                        </Route>
                        <Route path={"/sir"}>
                            <div>
                                <h1>TODO SIR</h1>
                            </div>
                        </Route>
                        <Route path={"/arima"}>
                            <div>
                                <h1>TODO ARIMA</h1>
                            </div>
                        </Route>
                    </Switch>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                <span>© 2020 Vykintas Valužis</span>
                <br/>
                <span>Webapp's icon made by strip from
                    <Typography.Link href={"https://flaticon.com"} target={"_blank"}> flaticon.com</Typography.Link>
                </span>
            </Footer>
        </Layout>
    );
}

export default App;
