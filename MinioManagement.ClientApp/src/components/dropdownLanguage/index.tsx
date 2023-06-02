import { Badge, FormControl, IconButton, InputLabel, Menu, MenuItem, Select } from "@mui/material"
import moment from "moment";
import { Fragment, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import TranslateIcon from '@mui/icons-material/Translate';
const DropdownLanguage = () => {
    const { t, i18n } = useTranslation()
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    const handleDropdownOpen = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget)
    }

    const handleChange = (value: string) => {
        i18n.changeLanguage(value as string);
        localStorage.setItem('language', value as string);
        switch (value) {
            case 'vi':
                moment.locale('vi');
                break;
            case 'en':
                moment.locale('en-gb');
                break;
            case 'zh':
                moment.locale('zh-cn');
                break;
            default:
                break;
        }
        setAnchorEl(null)
    };
    return (
        <Fragment>
            <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
                <TranslateIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={()=>setAnchorEl(null)}
                sx={{ '& .MuiMenu-paper': { width: 120, marginTop: 4 } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={() => handleChange('vi')}>Việt Nam</MenuItem>
                <MenuItem onClick={() => handleChange('en')}>English</MenuItem>
                <MenuItem onClick={() => handleChange('zh')} >中国人</MenuItem>
            </Menu>
        </Fragment>
    )
}

export default DropdownLanguage