import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import{useContext} from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import AuthContext from './authContext';


function Header() {
    const history = useHistory();
    const auth = useContext(AuthContext);
    
    const logout = () => {
        auth.logout();
        history.push('/');
    }
    
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    {
                        //Only show the user settings button if we have a user.
                        auth.user ?
                        <Box marginRight={'10px'}>
                            <Button type={"submit"} formTarget="_self" href={'/#/User_Settings'} color={'inherit'} variant='outlined' marginRight={"100px"} size={"large"}>
                                User Settings
                            </Button>
                        </Box> :
                        <Typography></Typography>
                    }
                    {
                        auth.user ?
                        <Button type={"submit"} formTarget="_self" href={'/#'} color={"inherit"} variant='outlined' size={"large"}>Home</Button>:
                        <Box marginRight={'164px'}>
                            <Button type={"submit"} formTarget="_self" href={'/#'} color={"inherit"} variant='outlined' size={"large"}>Home</Button>
                        </Box>
                    }
                    <Typography justifyContent={"center"} marginRight={"175px"} color="#FFFFFF" variant="h6" component="div" sx={{flexGrow: 1}}>
                        Decidr
                    </Typography>
                    {
                        !auth.user ?
                        <Button type={"submit"} formTarget="_self" href={'/#/login'} variant='outlined' color={"inherit"} size={"large"}>Login</Button> :
                        <Button type={"submit"} formTarget="_self" variant='outlined' color={"inherit"} size={"large"} onClick={() => logout()}>Logout</Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
