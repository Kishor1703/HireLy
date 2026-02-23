import { Box } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles';

const Footer = () => {
    const { palette } = useTheme();
    return (
        <>
            <Box sx={{
                height: '70px',
                bgcolor: palette.secondary.midNightBlue,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box component='span' sx={{ color: '#ffffff' }}>HIRELY</Box>

            </Box>
        </>
    )
}

export default Footer


// import React from 'react'

// const Footer = () =>{
//     return(
//         <div>
//             Footer
//         </div>
//     )
// }

// export default Footer
