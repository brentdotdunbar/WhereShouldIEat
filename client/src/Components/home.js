import React, {Fragment, useState} from 'react';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom'
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Input = styled(MuiInput)`
  width: 42px;
`;

let vegan = false
let vegetarian = false
let glutenFree = false
export default function Home(props) {
    let keywords = ""
    const [veganChecked, setVeganChecked] = useState(false)

    const veganChange = (event => {
        setVeganChecked(event.target.checked)
        changeKeyword(0)
    })
    const [vegetarianChecked, setVegetarianChecked] = useState(false)

    const vegetarianChange = (event => {
        setVegetarianChecked(event.target.checked)
        changeKeyword(1)
    })
    const [glutenChecked, setGlutenChecked] = useState(false)

    const glutenChange = (event => {
        setGlutenChecked(event.target.checked)
        changeKeyword(2)
    })


    const [value, setValue] = React.useState(1);
    const handleSliderChange = (event, newValue) => {
      setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };


    const handleBlur = () => {
        if (value < 0) {
          setValue(0);
        } else if (value > 3) {
          setValue(3);
        }
    };

    function changeKeyword(box) {
        if(box === 0){ //vegan
            vegan = !vegan
        } else if(box === 1){ //veggies :)
            vegetarian = !vegetarian
        } else if(box === 2){ // Gluten Free
            glutenFree = !glutenFree
        }

    }

    return (
        <Fragment>
            <Box marginTop="24px">
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Welcome to Decidr Home Page!
                </Typography>
            </Box>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Decidr is designed to help you pick a place to eat depending on your location!
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Just pick below whether you'd like to choose based on location or youre looking for the Decidr Randomizer
            </Typography>
            <Box padding='30px'
                 textAlign='center'
                 //display={"list-item"}
                 justifyContent={"space-between"}>
                     <Box padding={"10px"} alignItems="center" marginLeft="auto" marginRight="auto" width={500} justifyContent="center">
                        <Typography variant="h6" align="center" color="text.secondary" paragraph>
                            Set your Radius in Miles
                        </Typography>
                        <Box sx={{ width: 500 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                </Grid>
                                <Grid item xs>
                                <Slider
                                    min={1}
                                    max={3}
                                    step={.1}
                                    value={typeof value === 'number' ? value : 1}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                />
                                </Grid>
                                <Grid item>
                                <Input
                                    value={value}
                                    size="small"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                    step: .1,
                                    min: 1,
                                    max: 3,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    }}
                                />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Link to={{
                    pathname: "/decidr",
                    state: {value},
                    keyword: {vegan,vegetarian,glutenFree}
                    }}>
                        <Box padding={"10px"} alignItems="center" marginLeft="auto" marginRight="auto" width={500} justifyContent="center">
                            <Button type={"submit"} formTarget="_self" href={'/#/decidr'} variant='outlined' size={"large"}>
                                Decidr
                            </Button>
                        </Box>
                    </Link>
                    <Link to={{
                    pathname: "/rbl",
                    state: {value},
                    keyword: {vegan,vegetarian,glutenFree}
                    }}>
                        <Box padding={"10px"} alignItems="center" marginLeft="auto" marginRight="auto" width={500} justifyContent="center">
                            <Button type={"submit"} formTarget="_self" href={'/#/rbl'} variant='outlined' size={"large"}>
                                By Location
                            </Button>
                        </Box>
                    </Link>
                <FormControlLabel control={    <Checkbox
                    checked={veganChecked}
                    onChange={veganChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />} label="Vegan" />
                <FormControlLabel control={    <Checkbox
                    checked={vegetarianChecked}
                    onChange={vegetarianChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />} label="Vegetarian" />
                <FormControlLabel control={    <Checkbox
                    checked={glutenChecked}
                    onChange={glutenChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />} label="Gluten Free" />
            </Box>
        </Fragment>
    )
}