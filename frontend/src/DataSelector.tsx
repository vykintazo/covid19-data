import React from "react";
import {Card, Checkbox, Col, Input, Row, Select} from "antd";
import {CheckboxChangeEvent} from "antd/lib/checkbox";


type Props = {
    handleSrcChange: (val: string) => void,
    handleCountryChange: (val: string) => void,
    srcs: { val: string, name: string }[]
    countries: string[]
    population?: string
    onChange?: (e: CheckboxChangeEvent) => void
    diff?: boolean
}

export default function DataSelector({handleSrcChange, handleCountryChange, onChange, srcs, countries, population, diff}: Props) {


    return (
        <Card style={{margin: "0 32px"}}>
            <Row gutter={{xs: 8, lg: 32}}>
                <Col xs={24} lg={8} style={{margin: 0}}>
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
                <Col xs={24} lg={8} style={{margin: 0}}>
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
                    </Select>
                </Col>
                {population ?
                    <Col xs={24} lg={8} style={{margin: 0}}>
                        <Input style={{width: "100%"}} placeholder="Population" value={population}/>
                    </Col>
                    :
                    diff !== undefined ?
                        <Col xs={24} lg={8} style={{margin: 0}}>
                            <Checkbox onChange={onChange} value={diff}>Daily</Checkbox>
                        </Col> :
                        null

                }

            </Row>
        </Card>
    )
}