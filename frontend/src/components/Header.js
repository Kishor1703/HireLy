import { Box, styled } from '@mui/material'
import React from 'react'
import headerImage from '../images/jobbg.png';
import SearchInputEl from './SearchInputEl';

const Header = () => {

    const StyleHeader = styled(Box)(({ theme }) => (
        {
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            backgroundImage: `linear-gradient(rgba(13,71,161,0.75), rgba(66,165,245,0.55)), url(${headerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: theme.palette.secondary.main
        }

    ));
    return (
        <>
            <StyleHeader >
                <SearchInputEl/>
            </StyleHeader>
        </>
    )
}

export default Header

