import {Button, Typography} from "@mui/material";

export default function Warning(props: {
    disclaimer: string,
    onClick: () => void
}) {
    return (
        <div id="warning-container">
            <Typography fontSize={"200%"} fontWeight={500}>WARNING!</Typography>
            <Typography fontSize={"150%"} >This action is irreversible!</Typography>
            <Typography fontSize={"100%"} sx={{ mt: "10px", mb: "10px" }} >{props.disclaimer}</Typography>
            <Typography>Do you wish to proceed?</Typography>
            <div id="warning-button-div">
                <Button
                    disableElevation
                    variant="contained"
                    color="error"
                    onClick={props.onClick}
                    sx={{ width: "35%" }}
                >Proceed</Button>
                <Button
                    disableElevation
                    variant="contained"
                    color="info"
                    sx={{ width: "35%" }}
                >Go Back</Button>
            </div>
        </div>
    )
}