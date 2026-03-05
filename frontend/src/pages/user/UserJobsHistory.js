import { Typography, Box, Divider, Chip } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import CardElement from '../../components/CardElement'
import { userProfileAction } from '../../redux/actions/userAction'
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

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
            const historyRows = (user?.jobsHistory || []).filter((h) => !h.jobId && h.title);
            if (historyRows.length === 0) { setResolvedHistoryJobs({}); return; }

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
                            && (!history.location || ((job?.location || '').trim().toLowerCase() === history.location.trim().toLowerCase()))
                        ));
                        const matched = exactMatch || jobs[0];
                        return [historyKey, matched ? { id: matched._id, companyName: matched.companyName, companyLogo: matched.companyLogo } : null];
                    } catch {
                        return [historyKey, null];
                    }
                })
            );

            const idMap = {};
            resolved.forEach(([key, value]) => { if (value) idMap[key] = value; });
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
                    status: application.status || 'pending',
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
            status: history.applicationStatus || 'pending',
        }));
    }, [applications, resolvedHistoryJobs, user]);

    const renderStatusChip = (status) => {
        const normalized = String(status || 'pending').toLowerCase();
        if (normalized === 'shortlisted') {
            return <Chip label="Shortlisted" size="small" color="success" />;
        }
        if (normalized === 'rejected') {
            return <Chip label="Rejected" size="small" color="error" />;
        }
        return <Chip label="Pending" size="small" color="warning" />;
    };

    return (
        <Box>
            {/* Page header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{
                    width: 40, height: 40, borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2f80ed, #0a2463)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <WorkHistoryOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0a2463', lineHeight: 1.2 }}>
                        Applied Jobs
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Your job application history
                    </Typography>
                </Box>
                {jobs.length > 0 && (
                    <Chip
                        label={`${jobs.length} application${jobs.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                            ml: 1,
                            bgcolor: '#eff6ff', color: '#1e4fd8',
                            fontWeight: 700, fontSize: '0.75rem',
                            border: '1px solid #dbeafe', borderRadius: '8px',
                        }}
                    />
                )}
            </Box>

            <Divider sx={{ borderColor: '#dbeafe', mb: 3, mt: 2 }} />

            {/* Error alert */}
            {applicationsError && jobs.length === 0 && (
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.2,
                    bgcolor: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: '12px', px: 2, py: 1.8, mb: 3,
                }}>
                    <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                    <Typography sx={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>
                        {applicationsError}
                    </Typography>
                </Box>
            )}

            {/* Empty state */}
            {jobs.length === 0 && !applicationsError && (
                <Box sx={{
                    textAlign: 'center', py: 10,
                    bgcolor: '#f8faff', borderRadius: '16px',
                    border: '1.5px dashed #dbeafe',
                }}>
                    <Box sx={{
                        width: 60, height: 60, borderRadius: '14px',
                        bgcolor: '#dbeafe', mx: 'auto', mb: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <InboxOutlinedIcon sx={{ fontSize: 28, color: '#1e4fd8' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#0a2463', fontSize: '1.05rem', mb: 0.5 }}>
                        No applications yet
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        Jobs you apply to will appear here
                    </Typography>
                </Box>
            )}

            {/* Job cards */}
            <Box>
                {jobs.map((job) => (
                    <Box key={job.key} sx={{ position: 'relative' }}>
                        <Box sx={{ position: 'absolute', right: 12, top: 12, zIndex: 2 }}>
                            {renderStatusChip(job.status)}
                        </Box>
                        <CardElement
                            id={job.id}
                            jobTitle={job.title}
                            description={job.description}
                            category=""
                            location={job.location}
                            companyName={job.companyName}
                            companyLogo={job.companyLogo}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default UserJobsHistory;
