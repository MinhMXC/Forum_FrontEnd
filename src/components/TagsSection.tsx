import Tag from "../interfaces/Tag";
import {Chip, Grid} from "@mui/material";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import textChipColour from "../helper/textChipColour";
import React from "react";

export default function TagsSection(props: {
    tags: Tag[],
    size: "medium" | "small",
    sx?: any
}) {
    return (
        <Grid container spacing={1} sx={props.sx}>
            {props.tags.map(tag =>
                <Grid item xs="auto" key={tag.id}>
                    <a href={APP_CONSTANTS.FRONTEND_URL + `?title=&body=&tags=${tag.tag_text}`}>
                        <Chip
                            variant="filled"
                            size={props.size}
                            label={tag.tag_text}
                            sx={{ backgroundColor: tag.colour, color: textChipColour(tag.colour) }}
                        />
                    </a>
                </Grid>
            )}
        </Grid>
    )
}