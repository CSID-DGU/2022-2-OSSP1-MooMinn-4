import React from 'react';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import * as XLSX from 'xlsx';

const UploadFile = () => {
    const input = React.useRef(null);
    const [placeholder, setPlaceholder] = React.useState('');

    const readExcel = async (file) => {
        const fileReader = await new FileReader()
        fileReader.readAsArrayBuffer(file)
    
        fileReader.onload = (e) => {
            const bufferArray = e?.target.result
            const wb = XLSX.read(bufferArray, { type: "buffer" })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]

            const data = XLSX.utils.sheet_to_json(ws)                
            //console.log(data)
            
            const UserDatas = [];
            for (var i=0; i<data.length; i++){
                const UserData = {};
                UserData['CNumber'] = data[i]['학수강좌번호']+'-'+data[i][''];
                UserData['ClassCredit'] = data[i]['등급'];
                UserData['TNumber'] = data[i]['년도']+'_'+data[i]['학기'][0];
                UserDatas.push(UserData)
            }
            console.log(UserDatas);
        }
    }

    return (
        <div>
            <Stack className="input_area" flexDirection={"row"}>
                <Stack 
                    className="upload_btn"
                    flexDirection={"row"}
                    onClick={() => {input.current?.click();}}
                >
                    <span className="upload_icon"><FileUploadOutlinedIcon/></span>
                    <span className="upload">파일 업로드</span>
                </Stack>
                <Box className="file_name">{placeholder}</Box>
                <input
                    type={"file"}
                    accept={".xlsx,.xls"}
                    ref={input}
                    style={{display:'none'}}
                    onChange={e => {
                        const file = e.target.files[0]
                        readExcel(file)
                        setPlaceholder(file.name);
                    }}
                />
            </Stack>
        </div>
    );
};

export default UploadFile;