import React from "react";
import {DataSchema} from "./types";
import {CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from "dayjs";
import {AntVQalitative10} from "./palettes";

type Props = {
    data?: DataSchema
}

const preprocessData = (data?: DataSchema) => {
    let i = 0;
    if(data){
        data.data.forEach((el: any) => {
            if(el.predConfirmed !== null){
                el["Confidence"] = data.additional?.data.confidence_int[i];
                el.Confidence[0] = el.Confidence[0].toFixed(0);
                el.Confidence[1] = el.Confidence[1].toFixed(0);
                i++;
            }
        })
        console.log(data);
        return data.data;
    }
    return undefined;

}
const ARIMAChart = ({data}: Props) => (
    <ResponsiveContainer width={"100%"} aspect={2.5}>
        <ComposedChart data={preprocessData(data)}
                       margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid vertical={false}/>
            <XAxis dataKey="Date"
                   interval={10}
                   allowDuplicatedCategory={false}
                   tickFormatter={(d) => dayjs(d).format('MMM D')}
            />
            <YAxis axisLine={false} tickLine={false}/>
            <Tooltip labelFormatter={(value) => dayjs(value).format("MMM D")}
                     formatter={(value: number, name: string) => (name.split("pred").length > 1 ? [value.toFixed(0), `${name.split("pred")[1]} prediction`] : value)}/>
            <Legend iconType={"plainline"}/>
            {data?.schema.fields.slice(1).map((el, i) =>
                <Line
                    key={`line-${i}`}
                    type="monotone"
                    dataKey={el.name}
                    stroke={AntVQalitative10[i]}
                    dot={false}
                    strokeWidth={2}
                />
            )}
            {/*<Area
                key={`area`}
                dataKey={"Confidence"}
                connectNulls={false}
            />*/}
        </ComposedChart>
    </ResponsiveContainer>
)

export default ARIMAChart;