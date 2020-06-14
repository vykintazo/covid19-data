import React from 'react';
import "antd/dist/antd.css";
import "./App.css"
import {Layout, Menu, Typography} from 'antd';
// import LineChart from "./LineChart";
import {Link, Route, Switch} from 'react-router-dom';
import logo from './icon_color.svg'
import Explore from "./Explore";
import SIR from "./SIR";

const {Header, Footer, Content} = Layout;


function App() {

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
                            <Explore/>
                        </Route>
                        <Route path={"/sir"}>
                            <div>
                                <SIR/>
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
