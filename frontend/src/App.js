import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CommonHome from './pages/CommonHome';
import NotFound from './pages/NotFound';
import {theme} from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogIn from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import UserJobsHistory from './pages/user/UserJobsHistory';
import EmployeeApplyJobs from './pages/user/EmployeeApplyJobs';
import UserRoute from './components/UserRoute';
import Layout from './pages/global/Layout';
import userInfoDashboard from './pages/user/UserInfoDasboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobPosterDashboard from './pages/poster/JobPosterDashboard';
import AdminCategory from './pages/admin/AdminCategory';
import AdminLocation from './pages/admin/AdminLocation';
import JobDetails from './pages/JobDetails';
import CompanyProfile from './pages/poster/CompanyProfile';
import PosterApplications from './pages/poster/PosterApplications';
import ManageJobs from './pages/poster/ManageJobs';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';

//HOC
const UserDashboardHOC = Layout(UserDashboard);
const UserJobsHistoryHOC = Layout(UserJobsHistory);
const EmployeeApplyJobsHOC = Layout(EmployeeApplyJobs);
const UserInfoDasboardHOC = Layout(userInfoDashboard);
const AdminDashboardHOC = Layout(AdminDashboard);
const JobPosterDashboardHOC = Layout(JobPosterDashboard);
const AdminCategoryHOC = Layout(AdminCategory);
const AdminLocationHOC = Layout(AdminLocation);
const CompanyProfileHOC = Layout(CompanyProfile);
const PosterApplicationsHOC = Layout(PosterApplications);
const ManageJobsHOC = Layout(ManageJobs);

const withPageTransition = (element) => (
  <PageTransition>{element}</PageTransition>
);


// Define your theme object
//const theme = createTheme();

const App = () => {
  return (
    <>
      <ToastContainer/>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Routes>
            <Route path='/' element={withPageTransition(<CommonHome />)} />
            <Route path='/jobs' element={withPageTransition(<Home />)} />
            <Route path='/job/:id' element={withPageTransition(<JobDetails />)} />
            <Route path='/search/location/:location' element={withPageTransition(<Home />)} />
            <Route path='/search/:keyword' element={withPageTransition(<Home />)} />
            <Route path='/login' element={withPageTransition(<LogIn />)} />
            <Route path='/admin/login' element={withPageTransition(<LogIn forcedRole="admin" />)} />
            <Route path='/register' element={withPageTransition(<Register />)} />
            <Route path='/verify-email' element={withPageTransition(<VerifyEmail />)} />
            <Route path='/forgot-password' element={withPageTransition(<ForgotPassword />)} />
            <Route path='/reset-password' element={withPageTransition(<ResetPassword />)} />
            <Route path='/user/dashboard' element={<UserRoute allowedRoles={[0]}><UserDashboardHOC /></UserRoute>} />
            <Route path='/user/apply-jobs' element={<UserRoute allowedRoles={[0]}><EmployeeApplyJobsHOC /></UserRoute>} />
            <Route path='/poster/dashboard' element={<UserRoute allowedRoles={[2]}><JobPosterDashboardHOC /></UserRoute>} />
            <Route path='/poster/manage-jobs' element={<UserRoute allowedRoles={[2]}><ManageJobsHOC /></UserRoute>} />
            <Route path='/poster/company-profile' element={<UserRoute allowedRoles={[2]}><CompanyProfileHOC /></UserRoute>} />
            <Route path='/poster/applications' element={<UserRoute allowedRoles={[2]}><PosterApplicationsHOC /></UserRoute>} />
            <Route path='/admin/dashboard' element={<UserRoute allowedRoles={[1]}><AdminDashboardHOC /></UserRoute>} />
            <Route path='/admin/users' element={<UserRoute allowedRoles={[1]}><AdminDashboardHOC /></UserRoute>} />
            <Route path='/admin/companies' element={<UserRoute allowedRoles={[1]}><AdminDashboardHOC /></UserRoute>} />
            <Route path='/admin/jobs' element={<UserRoute allowedRoles={[1]}><AdminDashboardHOC /></UserRoute>} />
            <Route path='/admin/category' element={<UserRoute allowedRoles={[1]}><AdminCategoryHOC /></UserRoute>} />
            <Route path='/admin/location' element={<UserRoute allowedRoles={[1]}><AdminLocationHOC /></UserRoute>} />
            <Route path='/user/jobs' element={<UserRoute allowedRoles={[0]}><UserJobsHistoryHOC /></UserRoute>} />
            <Route path='/user/info' element={<UserRoute allowedRoles={[0]}><UserInfoDasboardHOC /></UserRoute>} />
            <Route path='*' element={withPageTransition(<NotFound />)} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App;
