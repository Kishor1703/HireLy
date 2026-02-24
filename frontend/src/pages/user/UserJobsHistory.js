import { Alert, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import CardElement from '../../components/CardElement'
import { userProfileAction } from '../../redux/actions/userAction'

const UserJobsHistory = () => {
    const { user } = useSelector(state => state.userProfile);
    const dispatch = useDispatch();
    const [applications, setApplications] = useState([]);
    const [applicationsError, setApplicationsError] = useState('');
    const [resolvedHistoryJobs, setResolvedHistoryJobs] = useState({});

    useEffect(() => {
        dispatch(userProfileAction());
    }, [dispatch]);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                setApplicationsError('');
                const { data } = await axios.get('/api/applications/me');
                setApplications(data?.applications || []);
            } catch (error) {
                setApplications([]);
                setApplicationsError(
                    error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    'Unable to load applied jobs.'
                );
            }
        };

        loadApplications();
    }, []);

    useEffect(() => {
        const resolveLegacyHistoryIds = async () => {
            const historyRows = (user?.jobsHistory || []).filter((history) => !history.jobId && history.title);
            if (historyRows.length === 0) {
                setResolvedHistoryJobs({});
                return;
            }

            const resolved = await Promise.all(
                historyRows.map(async (history) => {
                    const historyKey = history._id || `${history.title}-${history.location || ''}`;
                    try {
                        const { data } = await axios.get('/api/jobs/show', {
                            params: { keyword: history.title, pageNumber: 1 },
                        });
                        const jobs = data?.jobs || [];
                        const exactMatch = jobs.find((job) => (
                            (job?.title || '').trim().toLowerCase() === history.title.trim().toLowerCase()
                            && (
                                !history.location
                                || ((job?.location || '').trim().toLowerCase() === history.location.trim().toLowerCase())
                            )
                        ));
                        const matched = exactMatch || jobs[0];
                        return [historyKey, matched ? {
                            id: matched._id,
                            companyName: matched.companyName,
                            companyLogo: matched.companyLogo,
                        } : null];
                    } catch (error) {
                        return [historyKey, null];
                    }
                })
            );

            const idMap = {};
            resolved.forEach(([key, value]) => {
                if (value) idMap[key] = value;
            });
            setResolvedHistoryJobs(idMap);
        };

        resolveLegacyHistoryIds();
    }, [user]);

    const jobs = useMemo(() => {
        if (applications.length > 0) {
            return applications
                .filter((application) => application.job)
                .map((application) => ({
                    key: application._id,
                    id: application.job?._id,
                    title: application.job?.title,
                    description: application.job?.description,
                    location: application.job?.location,
                    companyName: application.job?.companyName,
                    companyLogo: application.job?.companyLogo,
                }));
        }

        return (user?.jobsHistory || []).map((history, index) => ({
            key: history._id || `${history.title || 'history'}-${index}`,
            id: history.jobId || resolvedHistoryJobs[history._id || `${history.title}-${history.location || ''}`]?.id,
            title: history.title,
            description: history.description,
            location: history.location,
            companyName: history.companyName || resolvedHistoryJobs[history._id || `${history.title}-${history.location || ''}`]?.companyName,
            companyLogo: history.companyLogo || resolvedHistoryJobs[history._id || `${history.title}-${history.location || ''}`]?.companyLogo,
        }));
    }, [applications, resolvedHistoryJobs, user]);

    return (
        <>
            <Box>
                <Typography variant="h4" sx={{ color: "#fafafa" }}> Jobs History</Typography>
                {applicationsError && jobs.length === 0 ? <Alert severity="warning" sx={{ mb: 2 }}>{applicationsError}</Alert> : null}
                <Box>
                    {
                        jobs.map((job) => (
                            <CardElement
                                key={job.key}
                                id={job.id}
                                jobTitle={job.title}
                                description={job.description}
                                category=''
                                location={job.location}
                                companyName={job.companyName}
                                companyLogo={job.companyLogo}
                            />
                        ))
                    }
                </Box>
            </Box>
        </>
    )
}

export default UserJobsHistory
