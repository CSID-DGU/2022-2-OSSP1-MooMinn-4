import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './BChart.css';

const BChart = ({data, isMobile}) => {
    return (
      <div className="BChart">
        <h4 className="BChartTitle">많이 들은 강의 Top6</h4>
        <div style={{padding:'20px'}}>
          <ResponsiveContainer aspect={isMobile ? 1 / 1 : 7 / 2}>
            <BarChart
                data={data}
                margin={isMobile ? {top:30,left:-25,right:0,bottom:-10} : {top:30,left:-15,right:10,bottom:-20}}
            >
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="name" style={{fontSize: '0.9em'}} />
                <YAxis label={{value:"명", offset:-27, position:"insideTop"}} />
                <Tooltip />
                <Legend align='right' />
                <Bar dataKey="수강인원" fill="#1188ff" barSize={isMobile? 25 : 60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

export default BChart; 