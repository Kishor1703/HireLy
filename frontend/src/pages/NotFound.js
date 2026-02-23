import React from 'react'
import {Box} from '@mui/material'
import Footer from '../components/Footer'
import Navbar from '../components/NavBar'

const NotFound = ()=>{
    return(
        <>
            <Navbar/>
            <Box sx= {{height: '81vh', display: "flex", alignItems: "center", justifyContent: "center"}}>
                <h1>Page not found!</h1>

            </Box>
            <Footer/>
        </>
    )
}

export default NotFound