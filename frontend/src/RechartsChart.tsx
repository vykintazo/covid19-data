import React from "react";
import {DataSchema} from "./types";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from "dayjs";
import {AntVQalitative10} from "./palettes";

type Props = {
    data?: DataSchema
}
const RechartsChart = ({data}: Props) => (
    <ResponsiveContainer width={"100%"} aspect={2.5}>
        <LineChart data={data?.data}
                   margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid vertical={false}/>
            <XAxis dataKey="Date"
                   interval={10}
                   allowDuplicatedCategory={false}
                   tickFormatter={(d) => dayjs(d).format('MMM D')}
            />
            <YAxis axisLine={false} tickLine={false}/>
            <Tooltip labelFormatter={(value) => dayjs(value).format("MMM D")}/>
            <Legend iconType={"plainline"}/>
            {data && data.schema.fields.slice(1).map((el, i) =>
                <Line
                    key={`line-${i}`}
                    type="monotone"
                    dataKey={el.name}
                    stroke={AntVQalitative10[i]}
                    dot={false}
                    strokeWidth={2}
                />
            )}
        </LineChart>
    </ResponsiveContainer>
)

export default RechartsChart;