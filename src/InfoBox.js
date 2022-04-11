import React from 'react';
import "./InfoBox.css";
import {
    Card, CardContent, Typography
} from "@material-ui/core";

function InfoBox({title, cases, total, vaccinated}) {
    return (
        <Card className="infoBox">
            <CardContent>
                {/* Title - CoronaViris Cases*/}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                {/* +000k Number of Cases */}
                <h2 className = "infoBox__cases">{cases}</h2>

                {/* 1M Total Cases */}
                <Typography className = "infoBox__total" color="textSecondary">
                    {vaccinated}
                </Typography>

                <Typography className = "infoBox__vaccinated" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
