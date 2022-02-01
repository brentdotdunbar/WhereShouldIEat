import React, {useContext, Fragment, Component} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Modal, ModalBody, ModalFooter} from 'react-bootstrap'
import ModalHeader from "react-bootstrap/ModalHeader";
import ReactHtmlParser from 'react-html-parser';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import AuthContext from './authContext';

const theme = createTheme();
let lat = 38.444342620549875;
let lng = -122.7031968966762;
let loc;

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Decidr
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
  
//CREATES CARDS THAT CAN DO THINGS

class HistoryCards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            center: {
                lat,
                lng
            },
            zoom: 13,
            pins: [{name: '', lat: null, lng: null, id: 999}],
            cards: [1],
            cardValues: [{
                name: "Placeholder",
                nImg: "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/",
                address: "No address",
                key: 0
            }],
            click: 0,
            show: false,
            directions: []
        };
    }

    async getDirections(num) {
        let x = [];
        if (num === -1) {
            return
        }
        
        const reqStr = "http://108.194.253.176:25565/directions/" + lat + "," + lng + "&destination=" + loc[num].lat + "," + loc[num].lng;
        await fetch(reqStr)
            .then(r => r.json())
            .then(data => (x = data['routes'][0]['legs'][0]['steps']))
            //.then(data => console.log(x))
            .then(data => this.setState({ directions: x}))
            .then(data => console.log(this.state.directions))
            //.then(data => this.setDir(x))
    }
    
    setDir(x) {
        let dir = []
        console.log(x)
        for (let i in x) {
            console.log(x[i]['maneuver'])
            switch (x[i]['maneuver']) {
                case('undefined'):
                    dir.push(" for ")
                    break;
                default: {
                    dir.push(" in ")
                }
            }
        }
        this.setState({
            directions: x,
            directionsWord: dir
        })
        console.log("d", this.state.directions)
    }

    handleModal(n) {
        this.setState({show:!this.state.show, click: n})
        if (!this.state.show) {
            this.getDirections(n)
        } else {
            this.setState({directions: []})
        }
    }
    
    setFavorite(n) {
        console.log('fav', n);
    }

    async componentDidMount() {
        const username = document.cookie.split('=')[1];
        if (username.length === 0) {
            return;
        }
        
        loc = await fetch(`http://localhost:25566/api/user/history/${username}`)
        .then((response) => response.json())
        .then((data) => {return data});
        
        console.log("list", loc);
        
        if (loc === 'undefined') {
            loc.length = 0;
            return;
        }
        
        this.addCards();
    }

    async addCards() {
        let newCards = this.state.cards
        let newVals = this.state.cardValues
        if (loc.length === 0) {
            newVals[0].name = "No restaurants in your area"
            this.setState({
                cardValues: newVals
            })
            return;
        }
        newVals.pop();
        console.log(newCards.length);
        for (let i in loc) {
            //set to 10 places max for demonstration purposes
            if (i >= 10) {
                return;
            }
            newCards.push(this.state.cards.length);
            let newImg = await this.getImg(i);
            if (newImg !== "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/") {
                newImg = URL.createObjectURL(newImg);
            }
            
            let added = new Date(loc[i].dateAdded);
            let dd = String(added.getDate()).padStart(2, '0');
            let mm = String(added.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = added.getFullYear();
            added = mm + '/' + dd + '/' + yyyy;
            
            newVals.push({
                name: loc[i]["name"],
                nImg: newImg,
                address: loc[i].address,
                dateAdded: added,
                key: newCards.length
            })
        }
        newCards.shift();
        this.setState({
            cards: newCards,
            cardValues: newVals
        })
        console.log("Current State:", this.state)
    }

    //GETS RANDOM IMG
    async getImg(num) {
        let x;
        //console.log(loc[num]['photos'])
        if ((typeof loc[num].photoRef) === 'undefined') {
            return "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/"
        }
        
        const reqStr = "http://108.194.253.176:25565/pics/" + loc[num].photoRef + "&maxwidth=300" + "&maxheight=500"
        await fetch(reqStr)
            .then(r => r.blob())
            .then(r => (x = r));
        return x;
    }

    render() {
        return (
            // Important! Always set the container height explicitly
            <div id="gmap_canvas" style={{ height: '100%', width: '95%',
                marginLeft:"auto", marginRight:"auto", marginTop:"-40px"}}>
                <main>
                    {/* Hero unit */}
                    <Container sx={{ py: 8 }} maxWidth="lg">
                        {/* End hero unit */}
                        <Grid container spacing={2}>
                            {this.state.cards.map((card) => (
                                <Grid item key={card} xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                // 16:9
                                                pt: '1%',
                                            }}
                                            style={{height: '100%',
                                                width: '100%'}}
                                            image={this.state.cardValues[card-1].nImg}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h5">
                                                {this.state.cardValues[card-1].name}
                                            </Typography>
                                            <Typography variant="caption" component="h5">
                                                {this.state.cardValues[card-1].address}
                                            </Typography>
                                            <Typography variant="caption" component="h5">
                                                Last visited on {this.state.cardValues[card-1].dateAdded}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                                <div>
                                                    {/* eslint-disable-next-line no-restricted-globals */}
                                                    <Button id={card-1} onClick={() => {this.handleModal(event.target.id)}} variant="outlined" size="medium">Go again!</Button>
                                                    <IconButton id={card-1} onClick={() => {this.setFavorite(this.state.click)}} aria-label="fav"><StarBorderIcon/></IconButton>
                                                    {/*POPUP*/}
                                                    <Modal show={this.state.show}>
                                                        <ModalHeader>
                                                            Directions to: {this.state.cardValues[this.state.click].name}
                                                        </ModalHeader>
                                                        <ModalBody>
                                                            {this.state.directions.map(item =>
                                                                    <Box padding={'10px'}>
                                                                        {ReactHtmlParser(item["html_instructions"] + " in " + item['distance']['text'])}
                                                                    </Box>
                                                                // + this.state.directionsWord[item] + this.state.directions[item]['distance']['text']
                                                            )}
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button onClick={() => {this.handleModal(this.state.click)}} variant="outlined" size="medium">Close</Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                </div>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </main>
            </div>
        );
    }
}


export default function User(props) {
    const auth = useContext(AuthContext);
    
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
            <CssBaseline />
            <main>
            {
                !auth.user ?
                <Typography component="div" variant='h3' marginTop='24px'>
                    No user is logged in.
                </Typography> :
                
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'left'
                    }}
                >
                    <Box sx={{
                        textAlign: 'left'
                    }}>
                        <Typography component="h4" variant='h4'>Info:</Typography>
                        <Typography component="h5" variant='h5'>Email: {auth.user.username}</Typography>
                        <Typography component="h5" variant='h5'>Name: {auth.user.firstName + ' ' + auth.user.lastName}</Typography>
                        <Typography component="h5" variant='h5'>Birthday: {new Date(auth.user.birthDay).toLocaleDateString("en-US")}</Typography>
                        <Typography component="h5" variant='h5'>Your history: </Typography>
                    </Box>
                    <HistoryCards></HistoryCards>
                </Box>
            }
            </main>
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Copyright />
            </Box>
            </Container>
        </ThemeProvider>
    );
}
