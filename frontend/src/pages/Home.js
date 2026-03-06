import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Box, Card, Container, Stack, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { jobLoadAction } from '../redux/actions/jobAction';
import { useParams } from 'react-router-dom';
import { Pagination } from '@mui/material';
import CardElement from '../components/CardElement';
import Footer from '../components/Footer';
import LoadingBox from '../components/LoadingBox';
import SelectComponent from '../components/SelectComponent';
import { jobTypeLoadAction } from '../redux/actions/jobTypeAction';
import LocationFilterGroup from '../components/LocationFilterGroup';

const Home = () => {
    const { jobs, setUniqueLocation, pages, loading } = useSelector(state => state.loadJobs);
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const { keyword, location: routeLocation } = useParams();

    const [page, setPage] = useState(1);
    const [cat, setCat] = React.useState('');
    const [selectedLocations, setSelectedLocations] = React.useState([]);

    useEffect(() => {
        dispatch(jobLoadAction(page, keyword, cat, selectedLocations));
    }, [dispatch, page, keyword, cat, selectedLocations]);

    useEffect(() => {
        dispatch(jobTypeLoadAction());
    }, [dispatch]);

    useEffect(() => {
        if (!routeLocation || !Array.isArray(setUniqueLocation) || setUniqueLocation.length === 0) {
            return;
        }

        const routeNames = routeLocation.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
        const matchedIds = setUniqueLocation
            .filter((item) => routeNames.includes(item.locationName.toLowerCase()))
            .map((item) => item._id);

        setSelectedLocations(matchedIds);
        setPage(1);
    }, [routeLocation, setUniqueLocation]);

    const handleChangeCategory = (e) => {
        setCat(e.target.value);
        setPage(1);
    }

    const handleToggleLocation = (locationId) => {
        setSelectedLocations((prev) => (
            prev.includes(locationId)
                ? prev.filter((id) => id !== locationId)
                : [...prev, locationId]
        ));
        setPage(1);
    };

    return (
        <>
            <Box sx={{ bgcolor: "#eef5ff", minHeight: "100vh" }}>
                <NavBar />
                <Header />
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                        <Box sx={{ flex: 2, p: 2 }}>
                            <Card sx={{ minWidth: 150, mb: 3, mt: 3, p: 2, bgcolor: '#ffffff' }}>
                                <Box sx={{ pb: 2 }}>
                                    <Typography component="h4" sx={{ color: palette.secondary.main, fontWeight: 600 }}>
                                        Filter job by category
                                    </Typography>
                                    
                                </Box>
                                <SelectComponent handleChangeCategory={handleChangeCategory} cat={cat} />
                            </Card>
                            {/* jobs by location */}
                            <Card sx={{ minWidth: 150, mb: 3, mt: 3, p: 2, bgcolor: '#ffffff' }}>
                                <Box sx={{ pb: 2 }}>
                                    {/* <h4>Filter by category</h4> */}
                                    <Typography component="h4" sx={{ color: palette.secondary.main, fontWeight: 600 }}>
                                        Filter job by location
                                    </Typography>
                                    <LocationFilterGroup
                                        options={setUniqueLocation || []}
                                        selectedIds={selectedLocations}
                                        onToggle={handleToggleLocation}
                                        onClear={() => {
                                            setSelectedLocations([]);
                                            setPage(1);
                                        }}
                                    />

                                </Box>
                            </Card>
                        </Box>
                        <Box sx={{ flex: 5, p: 2 }}>
                            {
                                loading ?
                                    <LoadingBox /> :
                                    jobs && jobs.length === 0 ?
                                        <>
                                            <Box
                                                sx={{
                                                    minHeight: '350px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>

                                                <h2>No result found!</h2>
                                            </Box>
                                        </> :
                                        jobs && jobs.map((job, i) => (
                                            <CardElement
                                                key={i}
                                                id={job._id}
                                                jobTitle={job.title}
                                                description={job.description}
                                                companyName={job.companyName}
                                                companyLogo={job.companyLogo}
                                                companyVerified={Boolean(job?.user?.companyVerified)}
                                                category={job.jobType ? job.jobType.jobTypeName : "No category"}
                                                location={job.location}
                                            />
                                        ))
                            }
                            <Stack spacing={2} >
                                <Pagination page={page} count={pages === 0 ? 1 : pages} onChange={(event, value) => setPage(value)} />
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>
            <Footer />

        </>
    )
}

export default Home
