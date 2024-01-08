import {Backdrop, Button, Grid, TextField} from "@mui/material";
import User from "../interfaces/User";
import parseString from "../helper/parseString";
import {NavigateFunction, useLoaderData, useNavigate} from "react-router-dom";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import fetchWithHeader from "../helper/fetchWithHeader";
import {useState} from "react";
import ErrorText from "../components/ErrorText";
import parseError from "../helper/parseError";
import UserAvatar from "../components/UserAvatar";
import getTextFieldValue from "../helper/getTextFieldValue";

function ChangeButton(props: {
    onClick: any,
    text: string
}) {
    return (
        <Button
            onClick={props.onClick}
            variant="contained"
            disableElevation
            sx={{mt: {xs: "1%", sm: 0}}}
        >
            {props.text}
        </Button>
    )
}

function ChangeAvatar(props: {
    user: User,
    navigate: NavigateFunction
}) {
    const user = props.user
    const navigate = props.navigate
    const [imageURL, setImageURL] = useState<string>(user.image)
    const [error, setError] = useState<string>("")
    console.log("bruh")

    async function buttonOnClick() {
        const res = await
            fetchWithHeader(`/users/${user.id}`, "PATCH", {image: imageURL} as any)
        if (res.status === "error") {
            setError(parseError(res.message))
            return
        }
        setError("Success")
        navigate(0)
    }

    return (
        <div className="section-container">
            <p className="section-title-text">Avatar</p>
            <Grid
                container
                spacing={1}
                sx={{ flexDirection: "row-reverse", alignItems: "end", mt: 1 }}
            >
                <Grid item xs="auto">
                    <UserAvatar user={user} src={imageURL} size={APP_CONSTANTS.AVATAR_SMALL} />
                </Grid>
                <Grid item xs="auto">
                    <UserAvatar user={user} src={imageURL} size={APP_CONSTANTS.AVATAR_MEDIUM} />
                </Grid>
                <Grid item xs="auto">
                    <UserAvatar user={user} src={imageURL} size={APP_CONSTANTS.AVATAR_BIG} />
                </Grid>
                <Grid item xs>
                    <TextField
                        label="Avatar's URL"
                        defaultValue={parseString(user.image)}
                        onChange={(event) => {setImageURL(event.target.value)}}
                        sx={{ width: "100%" }}
                    />
                </Grid>
            </Grid>
            <ErrorText error={error} />
            <ChangeButton onClick={buttonOnClick} text="Change Avatar" />
        </div>
    )
}

function ChangeBio(props: {
    user: User,
    navigate: NavigateFunction
}) {
    const user = props.user
    const navigate = props.navigate
    const [error, setError] = useState<string>("")

    async function buttonOnClick() {
        const newBio = getTextFieldValue("change-bio-textfield")
        const res = await fetchWithHeader(`/users/${user.id}`, "PATCH", {bio: newBio} as any)
        if (res.status === "error") {
            setError(parseError(res.message))
            return
        }

        setError("Success")
        navigate(0)
    }

    return (
        <div className="section-container">
            <p className="section-title-text">Bio</p>
            <TextField
                id="change-bio-textfield"
                label="Bio"
                defaultValue={user.bio}
                multiline
                sx={{ width: "100%", mt: 1 }}
            />
            <ErrorText error={error} />
            <ChangeButton onClick={buttonOnClick} text="Change Bio" />
        </div>
    )
}

function ChangePassword(props: {
    navigate: NavigateFunction
}) {
    const navigate: NavigateFunction = props.navigate
    const [error, setError] = useState<string>("")

    async function buttonOnClick() {
        const password = getTextFieldValue("password")
        const confirm_password = getTextFieldValue("confirm-password")
        const res = await fetchWithHeader(`/auth/password`, "PATCH",
            {password: password, password_confirmation: confirm_password} as any)
        if (!res.success) {
            setError(parseError(res.errors.full_messages))
            return
        }
        setError("Success")
        navigate(0)
    }

    return (
        <div className="section-container">
            <p className="section-title-text">Change Password</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                    id="password"
                    label="New Password"
                    type="password"
                    sx={{ mt: 1 }}
                />
                <TextField
                    id="confirm-password"
                    type="password"
                    label="Confirm New Password"
                    sx={{ mt: "10px" }}
                />
            </div>
            <ErrorText error={error}/>
            <ChangeButton onClick={buttonOnClick} text="Change Password" />
        </div>
    );
}

function DeleteAccount(props: {
    user_id: number,
    navigate: NavigateFunction
}) {
    const user_id = props.user_id
    const navigate = props.navigate
    const [open, setOpen] = useState<boolean>(false)

    async function buttonOnClick() {
        await fetchWithHeader(`/users/${user_id}`, "DELETE")
        navigate(0)
    }

    return (
        <div className="section-container">
            <p className="section-title-text">Delete Account</p>
            <Button
                color="error"
                variant="contained"
                disableElevation
                onClick={() => setOpen(true)}
                sx={{ mt: 2 }}
            >Delete Account</Button>

            <Backdrop open={open} onClick={() => setOpen(false)} sx={{ zIndex: 999 }}>
                <div className="section-container">
                    <p className="section-title-text">Warning</p>
                    <p id="warning-body-paragraph">
                        This will PERMANENTLY delete your account with no ways to recover.<br />
                        Are you sure you want to do this?
                    </p>
                    <p style={{ marginTop: "2%" }}>
                        *This will not delete your posts or comments
                    </p>
                    <Button
                        variant="contained"
                        color="error"
                        disableElevation
                        onClick={buttonOnClick}
                        sx={{ mt: "2%" }}
                    >Proceed</Button>
                </div>
            </Backdrop>
        </div>
    )
}

export default function AccountRoute() {
    const user = useLoaderData() as User
    const navigate = useNavigate()

    return (
        <>
            <ChangeAvatar user={user} navigate={navigate} />
            <ChangeBio user={user} navigate={navigate} />
            <ChangePassword navigate={navigate} />
            <DeleteAccount user_id={user.id} navigate={navigate} />
        </>
    )
}