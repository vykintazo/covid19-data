import React from "react";
import {DataSchema} from "./types";
import {CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from "dayjs";
import {AntVQalitative10} from "./palettes";

type Props = {
    data?: DataSchema
    playground?: boolean
    diff?: boolean
}
const RechartsChart = ({data, playground = false, diff = false}: Props) => (
    <ResponsiveContainer width={"100%"} aspect={2.5}>
        <ComposedChart data={data?.data}
                       margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid vertical={false}/>
            {playground ?
                <XAxis dataKey="Day"
                       interval={5}
                       allowDuplicatedCategory={false}
                />
                :
                <XAxis dataKey="Date"
                       interval={10}
                       allowDuplicatedCategory={false}
                       tickFormatter={(d) => dayjs(d).format('MMM D')}
                />
            }
            <YAxis axisLine={false} tickLine={false}/>
            {!playground ?
                <Tooltip labelFormatter={(value) => dayjs(value).format("MMM D")}
                         formatter={(value: number, name: string) => (name === "sirInfected" ? [value.toFixed(0), "Infected prediction"] : [value, name])}/>
                :
                <Tooltip labelFormatter={(value) => `Day ${value}`}/>
            }
            <Legend iconType={"plainline"}/>
            {data?.schema.fields.slice(1, 5).map((el, i) =>
                <Line
                    key={`line-${i}`}
                    type="monotone"
                    dataKey={el.name}
                    stroke={AntVQalitative10[i]}
                    dot={false}
                    strokeWidth={2}
                />
            )}

            {data && data.schema.fields.length > 4 &&
            <Line
                key={`line-sir`}
                type="monotone"
                dataKey={"sirInfected"}
                stroke={"#F4664A"}
                dot={false}
                strokeWidth={3}
                strokeDasharray={"5 5"}
            />
            }
        </ComposedChart>
    </ResponsiveContainer>
)

export default RechartsChart;