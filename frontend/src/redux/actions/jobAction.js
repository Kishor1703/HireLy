import axios from 'axios';
import { JOB_LOAD_FAIL, JOB_LOAD_REQUEST, JOB_LOAD_SUCCESS } from "../constants/jobconstant"

const getErrorMessage = (error, fallback) =>
    error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;


export const jobLoadAction = (pageNumber, keyword = '', cat = '', location = '') => async (dispatch) => {
    dispatch({ type: JOB_LOAD_REQUEST });
    try {
        const { data } = await axios.get(`/api/jobs/show/?pageNumber=${pageNumber}&keyword=${keyword}&cat=${cat}&location=${location}`)
        dispatch({
            type: JOB_LOAD_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: JOB_LOAD_FAIL,
            payload: getErrorMessage(error, 'Failed to load jobs')
        });
    }
}


// import { JOB_LOAD_FAIL, JOB_LOAD_REQUEST, JOB_LOAD_SUCCESS } from "../constants/jobconstant"
// import axios from 'axios';


// export const jobLoadAction = (pageNumber, keyword='', cat='', location='')=>async(dispatch)=>{
//     dispatch({type: JOB_LOAD_REQUEST});
//     try {
//         const {data} = await axios.get(`/api/jobs/show/?pageNumber=${pageNumber}&keyword=${keyword}&cat=${cat}&location=${location}`);
//         dispatch({
//             type: JOB_LOAD_SUCCESS,
//             payload: data
//         });
//     } catch (error) {
//         dispatch({
//             type: JOB_LOAD_FAIL,
//             payload: error.response.data.error
//         });
//     }
// }
