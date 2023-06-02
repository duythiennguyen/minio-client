import { MRT_Localization } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { MRT_Localization_ZH_HANS  } from 'material-react-table/locales/zh-Hans';

export const getLanguageByMRT = ():MRT_Localization=>{
    const language = localStorage.getItem('language')
    switch(language){
        case'en':
        return MRT_Localization_ES
        case'zh':
        return MRT_Localization_ZH_HANS
        default:
        return MRT_Localization_VI
    }
}