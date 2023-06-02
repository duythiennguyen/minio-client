import { useDispatch } from 'react-redux';
import { User } from 'oidc-client';
import { useEffect } from 'react';
import Error401 from 'src/pages/error/401'
import { useNavigate } from 'react-router-dom'
import { setAuth } from 'src/redux/slices/authSlice';
import userManager from 'src/commons/helpers/userManager';


const CallbackPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const successCallback = (user: User) => {
        var redirectPath = user.state.path as string;
        dispatch(setAuth({
            access_token:user.access_token,
            companyCode:user.profile.CompanyCode,
            departmentCode:user.profile.DepartmentCode,
            email:user.profile.email || '',
            fullName:user.profile.FullName,
            idp:user.profile.idp,
            name:user.profile.name  || '',
            permissions:user.profile.Permissions
        }))
        navigate(redirectPath)
    };

    const errorCallback = (error: Error) => {
        navigate('/401')
    };

    useEffect(() => {
        userManager
            .signinRedirectCallback()
            .then((user: any) => successCallback(user))
            .catch((error: any) => errorCallback(error));
    },[]);

   return <Error401 />;
};

export default CallbackPage;
