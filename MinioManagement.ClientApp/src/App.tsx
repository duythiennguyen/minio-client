import { CacheProvider } from '@emotion/react'

import ThemeComponent from 'src/@core/theme/ThemeComponent'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/assets/styles/globals.css'
import 'src/assets/styles/globals.scss'
import 'react-toastify/dist/ReactToastify.css';
import routes from './router'
import { RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './locales'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { render } from 'nprogress'
const clientSideEmotionCache = createEmotionCache()

const App = (props: any) => {
  const { emotionCache = clientSideEmotionCache } = props

  return (
    <CacheProvider value={emotionCache}>
      <SettingsProvider>
        <I18nextProvider i18n={i18n}>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <RouterProvider router={routes} />
                </ThemeComponent>
              )
            }}
          </SettingsConsumer>
          <ToastContainer />
        </I18nextProvider>
      </SettingsProvider>
    </CacheProvider>
  );
}

export default App;