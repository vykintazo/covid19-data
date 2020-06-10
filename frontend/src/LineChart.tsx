import React from "react";
import {
    createContainer,
    VictoryAxis,
    VictoryChart,
    VictoryCursorContainerProps,
    VictoryGroup,
    VictoryLine,
    VictoryTheme,
    VictoryVoronoiContainerProps
} from "victory";
import {DataSchema} from "./types";
import styled from 'styled-components'
import dayjs from "dayjs";
import {AntVQalitative10} from "./palettes";

interface CustomVictoryVoronoiContainerProps extends VictoryVoronoiContainerProps {
    mouseFollowTooltips: boolean
}

const CursorVoronoiContainer = createContainer<VictoryCursorContainerProps, CustomVictoryVoronoiContainerProps>("cursor", "voronoi");

type LineChartProps = {
    data?: DataSchema
}

const Container = styled("div")`
  color: #969696;
  margin: 5px;
  font-size: 12px;
  padding: 12px;
  opacity: 0.95;
  background-color: #ffffff;
  box-shadow: rgb(174, 174, 174) 0 0 10px;
  border-radius: 3px;
`;

const SList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`
const SListItem = styled.li`
  padding: 0;
  margin: 0 12px;
`
const Circle = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 8px;
`
type HTMLFlyOutProps = {
    datum?: any,
    center?: {x: number, y: number}
    d?: DataSchema,
    palette?: string[]
}
const HTMLFlyOut = ({datum, center, d, palette}: HTMLFlyOutProps) => {


    return (
        <g style={{pointerEvents: "none"}}>
            <foreignObject x={center!.x} y={center!.y} width="200" height="200">
                <Container
                    //@ts-ignore
                    xmlns="http://www.w3.org/1999/xhtml">
                    <p style={{fontWeight: 600}}>{`${datum._x.format("MMM D")}`}</p>
                    <SList>
                        {d?.schema.fields.slice(1).map((f, i) =>
                            <SListItem>
                                <Circle color={palette![i]}/>
                                <span>{`${f.name}:`}</span>
                                <span style={{display: "inline-block", float: "right", marginLeft: "20px"}}>{datum[f.name!]}</span>
                            </SListItem>
                        )}
                    </SList>
                </Container>
            </foreignObject>
        </g>
    )
}


const LineChart = ({data}: LineChartProps) => (
    <VictoryChart
        domain={data === undefined ? {
            x: [new Date("2020-02-01 00:00:00"), new Date("2020-06-01 00:00:00")],
            y: [0, 10000]
        } : undefined}
        domainPadding={10}
        theme={VictoryTheme.material}
        height={400}
        width={1000}
        scale={{x: "time"}}
        animate={{duration: 900}}
        containerComponent={
            <CursorVoronoiContainer
                labels={() => {
                    return `Confirmed`
                }}
                activateLabels={false}
                activateData={false}
                mouseFollowTooltips
                cursorDimension={"x"}
                voronoiDimension={"x"}
                voronoiBlacklist={["line-1", "line-2", "line-3"]}
                labelComponent={<HTMLFlyOut d={data} palette={AntVQalitative10}/>}/>
        }
    >
        <VictoryAxis style={{
            grid: {strokeWidth: 0},
            axis: {stroke: "#f0f0f0"},
            ticks: {stroke: "#f0f0f0"},
            tickLabels: {fontSize: 10, fill: "#969696"}
        }} scale={"time"}/>
        <VictoryAxis dependentAxis style={{
            grid: {strokeDasharray: 0},
            axis: {strokeWidth: 0},
            ticks: {stroke: "#f0f0f0"},
            tickLabels: {fontSize: 10, fill: "#969696"}
        }}/>
        <VictoryGroup colorScale={AntVQalitative10}
        >
            {data ? data.schema.fields.slice(1).map((el, i) =>
                <VictoryLine
                    name={`line-${i}`}
                    key={`line-${i}`}
                    style={{
                        data: {strokeWidth: 1.5}
                    }}
                    data={data.data}
                    x={(d) => dayjs(d.Date)}
                    y={el.name}
                    interpolation={"catmullRom"}
                />
            ) : []}
        </VictoryGroup>
    </VictoryChart>
)

export default LineChart;