// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { Outlet } from 'react-router-dom'
import LoadingPage from 'src/components/loadingPage'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import userManager from 'src/commons/helpers/userManager'
import { Button } from '@mui/material'
import { setAuthToken } from 'src/commons/helpers/set-auth-token'
import { t } from 'i18next'
const UserLayout = () => {
    // ** Hooks
    const authState = useSelector((state: any) => state.auth);
    useEffect(() => {
        if ((!authState.data.access_token || authState.data.access_token === '') && !window.location.hash.includes('id_token=')) {
            ReLogin()
        }
        else
            setAuthToken(authState.data.access_token)
    }, []);

    const { settings, saveSettings } = useSettings()
    const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

    const menuState = useSelector((state: any) => state.menu)
    const [menu, setMenu] = useState(menuState.data)
    useEffect(() => {
        setMenu([
            {
                title: t('menu.application'),
                icon: 'HomeOutline',
                path: '/application'
            },
            {
                title: t('menu.permission'),
                icon: 'HomeOutline',
                path: '/permission'
            },
            {
                title: t('menu.permissionGroup'),
                icon: 'HomeOutline',
                path: '/permission-group'
            },
            {
                title: t('menu.user'),
                icon: 'HomeOutline',
                path: '/user'
            }
        ])
    }, [menuState])

    const ReLogin = () => {
        userManager.signinRedirect({
            data: { path: location.pathname },
        });
    }

    return (
        <LoadingPage>
            {authState.isLogin ? (
                <VerticalLayout
                    hidden={hidden}
                    settings={settings}
                    saveSettings={saveSettings}
                    verticalNavItems={menu}
                    verticalAppBarContent={(
                        props
                    ) => (
                        <VerticalAppBarContent
                            hidden={hidden}
                            settings={settings}
                            saveSettings={saveSettings}
                            toggleNavVisibility={props.toggleNavVisibility}
                        />
                    )}
                >
                    <Outlet />
                </VerticalLayout>
            ) : (<div className='relogin-page'>
                <div>Đăng nhập không thành công vui lòng thử lại</div>
                <Button onClick={ReLogin}>Đăng nhập lại</Button>
            </div>)}
        </LoadingPage>
    )
}

export default UserLayout
