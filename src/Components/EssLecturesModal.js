import { React, useState } from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import './FindPW.css';

const ConversionTable = ({category, notTakingList}) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button onClick={handleOpen} size="small" sx={{padding:0, fontSize:12}}>목록보기</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className="modal">
                    <Box className="findPW" sx={{marginBottom:0}}>미이수 필수강의 목록</Box>
                    <Box className="findPW" sx={{fontSize:20}}>- {category}</Box>
                    <p style={{textAlign:"center"}}>{notTakingList}</p>
                </Box>
            </Modal>
        </div>
    )
}

export default ConversionTable