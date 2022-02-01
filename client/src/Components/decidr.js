import React, {Fragment, Component, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import GoogleMapReact from 'google-map-react';
import 'bootstrap/dist/css/bootstrap.css';
import {Modal, ModalBody, ModalFooter} from 'react-bootstrap'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ModalHeader from "react-bootstrap/ModalHeader";
import ReactHtmlParser from 'react-html-parser';

import{useContext} from 'react';
import AuthContext from './authContext';
let auth;

const cards = [1];
const theme = createTheme();
let lat = 38.444342620549875
let lng = -122.7031968966762
let num = -1;
let loc;

//LOCATION ARRAY
function getLoc(res) {
    loc = res;
    if (loc === 'undefined') {
        loc.length = 0;
    }
    console.log("list of locations:\n", loc);
}

function IHateReact() {
    auth = useContext(AuthContext);
    return (
        <Fragment></Fragment>
    );
}

//MAP FUNCTION
class SimpleMap extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        nImg: "https://c.tenor.com/kxZxwvPdm-wAAAAC/loading-loading-screen.gif",
        cardName: "Finding Restaurants!",
        addressName: "Address will appear here!",
        oldNums: [],
        center: {
            lat,
            lng
        },
        color: "",
        zoom: 13,
        pins: [{name: 'My location',lat:lat,lng:lng,id:0}],
        refresh: 0,
        keywords: "",
        directions: [],
        radius: 1609
    };

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(function(location) {
            let newLat = {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            };
            lat = location.coords.latitude;
            lng = location.coords.longitude;
            this.setState({
                center: newLat
            });
            console.log("Current Location:\n", newLat)
            
            if (this.props["value"] !== 'undefined') {
                this.setState({radius: this.props["value"]*1609})
            }
            let keyword = ""
            if(this.props["vegan"]){
                keyword = keyword + "vegan,"
            }
            if(this.props["vegetarian"]){
                keyword += "vegetarian,"
            }
            if(this.props["glutenFree"]){
                keyword+= "gluten,"
            }
            if(keyword.length > 1){
                keyword = keyword.slice(0, -1)
            }
            this.setState({
                keywords: keyword
            })
            console.log("new Rad: ", this.props["value"], "miles or in meters: ", this.state.radius)
            let res;
            //fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="  + location.coords.latitude  + "%2C" + location.coords.longitude + " &radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key)
            //With proxy
            if (!this.state.radius) {
                this.state.radius = 1609; //default radius
            }
            
            let reqStr = "http://108.194.253.176:25565/list/" + location.coords.latitude  + "%2C" + location.coords.longitude + "&radius=" + this.state.radius + "&type=restaurant";
            
            if (this.state.keywords) {
                reqStr += "&keyword=" + this.state.keywords;
            }
            
            console.log(reqStr);
            
            fetch(reqStr)
                .then(response => response.json())
                .then(data => (res = data['results']))
                .then(data => getLoc(res))
                .then(data => this.setPins(loc))
                .then(data => this.resetCard());
        }.bind(this));
        // https://cors-anywhere.herokuapp.com/corsdemo you need to authorize this
    }

    //adds Pins to pin for mapping
    setPins(loc) {
        let p = this.state.pins
        if (p.length === 1) {
            p.pop();
            p.push({
                name: "My Location",
                lat:lat,lng:lng,
                id:this.state.pins.id + 1,
                color: "red"
            });
            if (loc.length > 0 && this.state.refresh > 0) {
                p.push({
                    name: loc[num]['name'],
                    lat: loc[num]["geometry"]["location"]['lat'],
                    lng: loc[num]["geometry"]["location"]['lng'],
                    id: this.state.pins.id + 1,
                    color: "blue"
                });
            }
        } else if (p.length === 2) {
            p.pop();
            p.push({
                name: loc[num]['name'],
                lat:loc[num]["geometry"]["location"]['lat'],
                lng:loc[num]["geometry"]["location"]['lng'],
                id:this.state.pins.id + 1,
                color: "blue"
            });
        }
        this.setState({
            pins: p
        });
    }

    async getImg(num) {
        let x
        console.log(loc[num]['photos'])
        if ((typeof loc[num]['photos']) === 'undefined') {
            return "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/"
        }
        const reqStr = "http://108.194.253.176:25565/pics/" + loc[num]['photos'][0]['photo_reference'] + "&maxwidth=800" + "&maxheight=800"
        console.log(reqStr);
        await fetch(reqStr)
            .then(r => r.blob())
            .then(r => (x = r));
            
        console.log(x);
        return x
    }

    //ALL CARD SETTINGS NOW
    async resetCard() {
        this.setState({
            nImg: "https://c.tenor.com/kxZxwvPdm-wAAAAC/loading-loading-screen.gif",
            cardName: "Grabbing Fresh Restaurant",
            addressName: "One Moment Please"
        })
        if (loc.length > 0) {
            num = this.getRandomInt(loc.length)
            let newImg = await this.getImg(num)
            if (newImg !== "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/") {
                newImg = URL.createObjectURL(newImg)
            }
            
            let newState = {
                nImg: newImg,
                name: loc[num]['name'],
                addressName: loc[num]['vicinity'],
            };
            this.setState({
                cardName: newState.name,
                nImg: newState.nImg,
                addressName: newState.addressName,
                refresh: this.state.refresh + 1
            })
        } else {
            let newState = {
                nImg: "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/",
                name: 'There are no restaurants in your area.',
                addressName: 'No address'
            };
            this.setState({
                cardName: newState.name,
                nImg: newState.nImg,
                addressName: newState.addressName,
                refresh: this.state.refresh + 1
            })
        }
        this.setPins(loc)
        console.log("Updated Card and Map State", this.state)
    }

    //GETS RANDOM NUM
    getRandomInt(max) {
        let x = this.state.oldNums
        num = Math.floor(Math.random() * max)
        if (x.length === max) {
            x = []
            x.push(num)
        } else if (x.length < 1) {
            x.push(num);
        } else if (x.includes(num)) {
            return num = this.getRandomInt(max)
        } else {
            x.push(num)
        }
        this.setState({
            oldNums: x
        });
        return num;
    }

    //GETS RANDOM IMG
    async getImg(num) {
        let x
        //console.log(loc[num]['photos'])
        if ((typeof loc[num]['photos']) === 'undefined') {
            return "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/"
        }
        const reqStr = "http://108.194.253.176:25565/pics/" + loc[num]['photos'][0]['photo_reference'] + "&maxwidth=900" + "&maxheight=1080"
        //Using old CORS
        await fetch (reqStr)
            .then(r => r.blob())
            .then(r => (x = r))
        return x
    }

    render() {
        return (
            <Box padding={'0px'} justifyContent="center">
            <Container sx={{ py: 1 }} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={0}>
                    {cards.map((card) => (
                        <Grid item key={card} md={12} justifyContent="center">
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        pt: '%',
                                    }}
                                    style={{height: 700,
                                        width:900}}
                                    image={this.state.nImg}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align="center">
                                        {this.state.cardName}
                                    </Typography>
                                    <Typography>
                                        {this.state.addressName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box justifyContent={"center"} marginLeft={'285px'} marginRight={"50px"}>
                                        <Newpop
                                            name={this.state.cardName}
                                        />
                                    </Box>
                                    <Box justifyContent={"center"}><Button onClick={() => {this.resetCard()}} variant="outlined" size='medium'>Refresh</Button></Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
                <Box padding={"50px"}>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                        Here's your location in red and the restaurants in blue!
                    </Typography>
                    <div id="gmap_canvas" style={{ height: '50vh', width: '55%',
                        marginLeft:"auto", marginRight:"auto" }}>
                        <GoogleMapReact
                            yesIWantToUseGoogleMapApiInternals={true}
                            bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY }}
                            center={this.state.center}
                            defaultZoom={this.state.zoom}
                        >
                            {this.state.pins.map(item =>
                                <Marker
                                    id={item.id}
                                    name={item.name}
                                    lat={item.lat}
                                    lng={item.lng}
                                    color={item.color}
                                />
                            )
                            }
                        </GoogleMapReact>
                    </div>
                </Box>
            </Box>
        );
    }
}

//MAP MARKERS
class Marker extends Component {
    state = {
        name: "test",
        color: "blue",
        id: ""
    }
    render() {
        return (
            <div>
                <div className="marker"
                     style={{ backgroundColor: this.props.color, cursor: 'pointer'}}
                     title={this.props.name}
                />
                <div className="pulse" />
            </div>
        )
    }
}

//MODAL
class Newpop extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            show:false,
            name: "",
            directions: [],
            directionsWord: []
        }
    }
    async getDirections() {
        let x = [];
        if (num === -1) {
            return
        }
        const reqStr = "http://108.194.253.176:25565/directions/" + lat + "," + lng + "&destination=" + loc[num]["geometry"]["location"]['lat'] + "," + loc[num]["geometry"]["location"]['lng'];
        //Using old CORS
        await fetch(reqStr)
            .then(r => r.json())
            .then(data => (x = data['routes'][0]['legs'][0]['steps']))
            //.then(data => console.log(x))
            .then(data => this.setState({ directions: x}))
            .then(data => console.log(this.state.directions))
            .then(data => this.setDir(x))
        //console.log("d:", this.state.directions)
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
    
    async addToHistory() {
        const restaurant = loc[num];
        const username = document.cookie.split('=')[1];
        console.log(`Add to hist ${username} : ${restaurant.place_id}`);
        
        console.log(loc[num]);
        
        if (!restaurant.photos[0].photo_reference) {
            restaurant.photos[0].photo_reference = '';
        }
        
        await fetch(`http://localhost:25566/api/restaurant/new/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                place_id: restaurant.place_id,
                name: restaurant.name,
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
                photoRef: restaurant.photos[0].photo_reference,
                address: restaurant.vicinity
            })
        }).then(async (response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.json());
            } else if (response.status === 409) {
                console.log('Restaurant already existed.');
            } else {
                throw new Error(`Unexpected response: ${response}`);
            }
        });
        
        await fetch(`http://localhost:25566/api/user/addToHistory/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username: username,
                place_id: restaurant.place_id
            })
        }).then(async (response) => {
            console.log(response);
            if (response.status === 200 || response.status === 404) {
                console.log(response.json());
            } else if (response.status === 409) {
                console.log('Restaurant already in user history.');
            } else {
                throw new Error(`Unexpected response: ${response}`);
            }
        });
        /*
        let list = await fetch(`http://localhost:25566/api/user/history/${username}`)
        .then((response) => response.json())
        .then((data) => {return data});
        console.log("list", list);
        */
    }

    handleModal() {
        this.setState({show:!this.state.show})
        if (!this.state.show) {
            this.getDirections()
        } else {
            this.setState({directions: []})
        }
        
        this.addToHistory();
    }
    render() {
        return (
            <div>
                <Button onClick={() => {this.handleModal()}} variant="outlined" size="medium">Eat Here!</Button>
                {/*POPUP*/}
                <Modal show={this.state.show}>
                    <ModalHeader>
                        Directions to: {this.props.name}
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
                        <Button onClick={() => {this.handleModal()}} variant="outlined" size="medium">Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

//COPYRIGHT just for fun
function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                WTFSIE.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

//Master Export
export default function decider(props) {
    let parent = props.location.state;
    let keywords = props.location.keyword;
    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <main>
                    {/* Hero unit */}
                    <Box marginTop="24px"
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 0,
                            pb: 0,
                        }}
                    >
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                            >
                                Welcome to Decidr!
                            </Typography>
                            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                               Click refresh on the restaurant card and you'll get your restaurant
                            </Typography>
                        </Container>
                    </Box>
                    <SimpleMap {...parent}{...keywords}/>
                </main>
                {/* Footer */}
                <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                    <Copyright />
                </Box>
                {/* End footer */}
            </ThemeProvider>
        </Fragment>
    )
}
