import React from 'react';
import './Chart.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chart = ({title, data}) => {
  return (
    <div className="chart">
      <h4 className="chartTitle">{title}</h4>
      <div style={{padding:'20px'}}>
        <ResponsiveContainer aspect={11 / 6}>
          <LineChart 
            data={data}
            margin={{left:-5, right:40,bottom:-15}}
          >
            <CartesianGrid stroke="silver" strokeDasharray="2 2" />
            <XAxis 
              dataKey="name"
              label={{value:"학기", offset:10, position:"right"}} />
            <YAxis 
              label={{value:"평점", position:"insideTopLeft"}} 
              tickCount={10} 
              padding={{top: 10}} />
            <Tooltip />
            <Legend align='right' />
            <Line type="monotone" dataKey="나" stroke="#007FFF" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="평균" stroke="darkgray" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default chart;