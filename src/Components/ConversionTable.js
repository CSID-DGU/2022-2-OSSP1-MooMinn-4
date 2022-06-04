import { React, useState } from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './FindPW.css';

function createData(toeic, toeflCBT, toeflIBT, teps, toeicSpeaking, opic, esol, ielts, gtelp) {
    return { toeic, toeflCBT, toeflIBT, teps, toeicSpeaking, opic, esol, ielts, gtelp };
}

const rows = [
    createData(550, 136, 57, 436, 120, 'IL', 'PET', 4.5, 'LEVEL3 63'),
    createData(600, 177, 62, 478, 120, 'IL', 'PET', 5, 'LEVEL3 71\nLEVEL2 50'),
    createData(620, 182, 64, 494, 130, 'IM 1', 'PET', 5, 'LEVEL3 73\nLEVEL2 53'),
    createData(650, 192, 68, 521, 130, 'IM 1', 'PET', 5, 'LEVEL3 78\nLEVEL2 57'),
    createData(680, 200, 72, 551, 140, 'IM 2', 'FCE', 5.5, 'LEVEL3 82\nLEVEL2 61'),
    createData(700, 207, 76, 600, 140, 'IM 2', 'FCE', 5.5, 'LEVEL3 85\nLEVEL2 64'),
    createData(750, 212, 82, 633, 140, 'IM 2', 'FCE', 5.5, 'LEVEL3 92\nLEVEL2 69'),
    createData(800, 227, 87, 728, 150, 'IM 3', 'FCE', 6, 'LEVEL3 99\nLEVEL2 76'),
];

const ConversionTable = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button onClick={handleOpen} variant="outlined">환산표보기</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="tablemodal">
                    <Box className="findPW">
                        영어시험 점수 환산표
                    </Box>
                    <p>아래 표에서 어학시험의 점수와 <b>같은 행에 있는 토익점수</b>를 입력해주세요.</p>
                    <TableContainer component={Paper} sx={{ maxHeight: 500 }} className="table">
                      <Table size="small">
                        <TableHead>
                          <TableRow key="header" sx={{backgroundColor:'lightgray'}}>
                            <TableCell key="TOEIC" align="center">TOEIC</TableCell>
                            <TableCell key="TOEFL_CBT" align="center">TOEFL CBT</TableCell>
                            <TableCell key="TOEFL_IBT" align="center">TOEFL IBT</TableCell>
                            <TableCell key="TEPS" align="center">TEPS</TableCell>
                            <TableCell key="TOEIC_speaking" align="center">TOEIC Speaking</TableCell>
                            <TableCell key="OPIc" align="center">OPIc</TableCell>
                            <TableCell key="Cambridge_ESOL_Examinations" align="center">Cambridge ESOL Examinations</TableCell>
                            <TableCell key="IELTS_Academic" align="center">IELTS Academic</TableCell>
                            <TableCell key="G-TELP" align="center">G-TELP</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, idx) => (
                            <TableRow
                              key={row.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                            >
                              <TableCell key={idx} align="center" component="th" scope="row" sx={{backgroundColor:'#F2F2F2'}}>
                                {row.toeic}
                              </TableCell>
                              <TableCell key={idx} align="center">{row.toeflCBT}</TableCell>
                              <TableCell key={idx} align="center">{row.toeflIBT}</TableCell>
                              <TableCell key={idx} align="center">{row.teps}</TableCell>
                              <TableCell key={idx} align="center">{row.toeicSpeaking}</TableCell>
                              <TableCell key={idx} align="center">{row.opic}</TableCell>
                              <TableCell key={idx} align="center">{row.esol}</TableCell>
                              <TableCell key={idx} align="center">{row.ielts}</TableCell>
                              <TableCell key={idx} align="center">{row.gtelp}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </div>
    )
}

export default ConversionTable