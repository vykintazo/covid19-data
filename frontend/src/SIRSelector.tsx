import React from "react";
import {Button, Card, Form, InputNumber} from "antd";
import {Store} from "antd/lib/form/interface";


type Props = {
    onFinish: (values: Store) => void,
}
const layout = {
    labelCol: {span: 16},
    wrapperCol: {span: 16},
};

const params = ["Beta", "Gamma", "Population", "s0", "i0", "r0", "Days"]

export default function SIRSelector({onFinish}: Props) {


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Card style={{margin: "0 32px"}}>
            <Form
                {...layout}
                name="form"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout={"inline"}
            >
                {params.map((el, i) => (
                    <Form.Item
                        label={el}
                        name={el.toLowerCase()}
                        rules={[{required: true, message: `Please input ${el} parameter.`}]}
                    >
                        <InputNumber style={{width: '100px'}}/>
                    </Form.Item>

                ))
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Calculate SIR
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}