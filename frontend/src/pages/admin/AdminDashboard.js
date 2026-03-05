import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    companies: 0,
    pendingCompanies: 0,
    approvedCompanies: 0,
    rejectedCompanies: 0,
    verifiedCompanies: 0,
    unverifiedCompanies: 0,
    jobs: 0,
    applications: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [employeePage, setEmployeePage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);
  const [employeePages, setEmployeePages] = useState(1);
  const [companyPages, setCompanyPages] = useState(1);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [deletingId, setDeletingId] = useState('');
  const [updatingApprovalId, setUpdatingApprovalId] = useState('');
  const [updatingVerificationId, setUpdatingVerificationId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDashboard = async (search = '', employeePageNumber = 1, companyPageNumber = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = search ? { keyword: search } : {};
      const [statsRes, employeeRes, companyRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users', {
          params: { ...params, role: 0, pageSize: 10, pageNumber: employeePageNumber },
        }),
        axios.get('/api/admin/users', {
          params: { ...params, role: 2, pageSize: 10, pageNumber: companyPageNumber },
        }),
      ]);

      setStats({
        employees: statsRes?.data?.stats?.employees || 0,
        companies: statsRes?.data?.stats?.companies || 0,
        pendingCompanies: statsRes?.data?.stats?.pendingCompanies || 0,
        approvedCompanies: statsRes?.data?.stats?.approvedCompanies || 0,
        rejectedCompanies: statsRes?.data?.stats?.rejectedCompanies || 0,
        verifiedCompanies: statsRes?.data?.stats?.verifiedCompanies || 0,
        unverifiedCompanies: statsRes?.data?.stats?.unverifiedCompanies || 0,
        jobs: statsRes?.data?.stats?.jobs || 0,
        applications: statsRes?.data?.stats?.applications || 0,
      });
      setEmployees(employeeRes?.data?.users || []);
      setCompanies(companyRes?.data?.users || []);
      setEmployeePages(Math.max(1, Number(employeeRes?.data?.pages) || 1));
      setCompanyPages(Math.max(1, Number(companyRes?.data?.pages) || 1));
      setEmployeeCount(Number(employeeRes?.data?.count) || 0);
      setCompanyCount(Number(companyRes?.data?.count) || 0);
      setEmployeePage(Math.max(1, Number(employeeRes?.data?.page) || employeePageNumber));
      setCompanyPage(Math.max(1, Number(companyRes?.data?.page) || companyPageNumber));
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDashboard(keyword.trim(), 1, 1);
  };

  const handleDeleteUser = async (user, userTypeLabel) => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
    const confirmText =
      userTypeLabel === 'Company'
        ? `Delete ${name}? This will also delete all jobs posted by this company and related applications.`
        : `Delete ${name}?`;

    if (!window.confirm(confirmText)) return;

    setDeletingId(user._id);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.delete(`/api/admin/user/delete/${user._id}`);
      const cleanup = data?.cleanup;
      const cleanupNote = cleanup && userTypeLabel === 'Company'
        ? ` Removed ${cleanup.deletedJobsCount || 0} jobs and ${cleanup.deletedApplicationsCount || 0} applications.`
        : '';

      setMessage(`${userTypeLabel} account deleted.${cleanupNote}`);
      fetchDashboard(keyword.trim(), employeePage, companyPage);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || `Failed to delete ${userTypeLabel.toLowerCase()}`);
    } finally {
      setDeletingId('');
    }
  };

  const cards = useMemo(() => ([
    { label: 'Employees', value: stats.employees },
    { label: 'Companies', value: stats.companies },
    { label: 'Pending Companies', value: stats.pendingCompanies },
    { label: 'Approved Companies', value: stats.approvedCompanies },
    { label: 'Verified Companies', value: stats.verifiedCompanies },
    { label: 'Total Jobs', value: stats.jobs },
    { label: 'Applications', value: stats.applications },
  ]), [stats]);

  const updateCompanyApproval = async (userId, status) => {
    setUpdatingApprovalId(userId);
    setError('');
    setMessage('');
    try {
      await axios.patch(`/api/admin/company/${userId}/approval`, { status });
      setMessage(`Company marked as ${status}.`);
      fetchDashboard(keyword.trim(), employeePage, companyPage);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to update company approval status');
    } finally {
      setUpdatingApprovalId('');
    }
  };

  const getStatusChip = (status) => {
    const normalizedStatus = status || 'approved';
    if (normalizedStatus === 'approved') {
      return <Chip label="Approved" size="small" color="success" />;
    }
    if (normalizedStatus === 'rejected') {
      return <Chip label="Rejected" size="small" color="error" />;
    }
    return <Chip label="Pending" size="small" color="warning" />;
  };

  const updateCompanyVerification = async (userId, verified) => {
    setUpdatingVerificationId(userId);
    setError('');
    setMessage('');
    try {
      await axios.patch(`/api/admin/company/${userId}/verification`, { verified });
      setMessage(verified ? 'Company marked as verified.' : 'Company verification removed.');
      fetchDashboard(keyword.trim(), employeePage, companyPage);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to update company verification');
    } finally {
      setUpdatingVerificationId('');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#000000', mb: 2, fontWeight: 700 }}>
        Admin Dashboard
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by name, email, or company"
            size="small"
            sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 320 }}
          />
          <Button variant="contained" type="submit" sx={{ textTransform: 'none' }}>
            Search
          </Button>
          <Button variant="outlined" onClick={() => { setKeyword(''); fetchDashboard(''); }} sx={{ textTransform: 'none' }}>
            Reset
          </Button>
        </Stack>
      </Box>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={card.label}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0a2463' }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Manage Employees</Typography>
                <Chip label={`${employeeCount} found`} size="small" />
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Button
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(user, 'Employee')}
                            disabled={deletingId === user._id}
                          >
                            {deletingId === user._id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No employees found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {employeePages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                  <Pagination
                    page={employeePage}
                    count={employeePages}
                    onChange={(event, value) => fetchDashboard(keyword.trim(), value, companyPage)}
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Manage Companies</Typography>
                <Chip label={`${companyCount} found`} size="small" />
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Owner</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Verification</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.map((user) => {
                      const companyStatus = user.companyApprovalStatus || 'approved';
                      return (
                        <TableRow key={user._id}>
                          <TableCell>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.companyName || '-'}</TableCell>
                          <TableCell>{getStatusChip(companyStatus)}</TableCell>
                          <TableCell>
                            {user.companyVerified
                              ? <Chip label="Verified" size="small" color="success" />
                              : <Chip label="Unverified" size="small" variant="outlined" />
                            }
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            {companyStatus !== 'approved' && (
                              <Button
                                color="success"
                                size="small"
                                onClick={() => updateCompanyApproval(user._id, 'approved')}
                                disabled={updatingApprovalId === user._id}
                              >
                                Approve
                              </Button>
                            )}
                            {companyStatus !== 'rejected' && (
                              <Button
                                color="warning"
                                size="small"
                                onClick={() => updateCompanyApproval(user._id, 'rejected')}
                                disabled={updatingApprovalId === user._id}
                              >
                                Reject
                              </Button>
                            )}
                            <Button
                              color={user.companyVerified ? 'secondary' : 'info'}
                              size="small"
                              onClick={() => updateCompanyVerification(user._id, !user.companyVerified)}
                              disabled={updatingVerificationId === user._id || deletingId === user._id}
                            >
                              {updatingVerificationId === user._id
                                ? 'Updating...'
                                : (user.companyVerified ? 'Unverify' : 'Verify')}
                            </Button>
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleDeleteUser(user, 'Company')}
                              disabled={deletingId === user._id || updatingApprovalId === user._id || updatingVerificationId === user._id}
                            >
                              {deletingId === user._id ? 'Deleting...' : 'Delete Company'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {companies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">No companies found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {companyPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                  <Pagination
                    page={companyPage}
                    count={companyPages}
                    onChange={(event, value) => fetchDashboard(keyword.trim(), employeePage, value)}
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  );
};

export default AdminDashboard;
