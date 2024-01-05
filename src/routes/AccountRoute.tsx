import {Avatar, Backdrop, Button, Grid, TextField} from "@mui/material";
import User from "../interfaces/User";
import parseString from "../helper/parseString";
import default_avatar from "../resources/default_avatar.jpg";
import {NavigateFunction, useLoaderData, useNavigate} from "react-router-dom";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import fetchWithHeader from "../helper/fetchWithHeader";
import {useState} from "react";
import ErrorText from "../components/ErrorText";
import parseError from "../helper/parseError";

const marginTop = 2

function ChangeAvatar(prop: any) {
    const user = prop.user as User
    const navigate: NavigateFunction = prop.navigate
    const [imageURL, setImageURL] = useState<string>(user.image)
    const [error, setError] = useState<string>("")

    async function buttonOnClick() {
        const res = await fetchWithHeader(`/users/${user.id}`, "PATCH", {image: imageURL} as any)
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
            <Grid container spacing={1} sx={{ flexDirection: "row-reverse", alignItems: "end", mt: marginTop - 1 }}>
                <Grid item xs="auto">
                    <Avatar alt={user.username} src={parseString(imageURL)} sx={{ height: APP_CONSTANTS.AVATAR_SMALL, width: APP_CONSTANTS.AVATAR_SMALL }}>
                        <Avatar alt="default" src={default_avatar} sx={{ height: "100%", width: "100%" }} />
                    </Avatar>
                </Grid>
                <Grid item xs="auto">
                    <Avatar alt={user.username} src={parseString(imageURL)} sx={{ height: APP_CONSTANTS.AVATAR_MEDIUM, width: APP_CONSTANTS.AVATAR_MEDIUM }}>
                        <Avatar alt="default" src={default_avatar} sx={{ height: "100%", width: "100%" }} />
                    </Avatar>
                </Grid>
                <Grid item xs="auto">
                    <Avatar alt={user.username} src={parseString(imageURL)} sx={{ height: APP_CONSTANTS.AVATAR_BIG, width: APP_CONSTANTS.AVATAR_BIG }}>
                        <Avatar alt="default" src={default_avatar} sx={{ height: "100%", width: "100%" }} />
                    </Avatar>
                </Grid>
                <Grid item xs>
                    <TextField label="Avatar's URL" defaultValue={parseString(user.image)}
                               onChange={(event) => {setImageURL(event.target.value)}}
                               sx={{ width: "100%" }}
                    />
                </Grid>
            </Grid>
            <ErrorText error={error} />
            <Button onClick={buttonOnClick} variant="contained" disableElevation>Change Avatar</Button>
        </div>
    )
}

function ChangeBio(prop: any) {
    const user = prop.user as User
    const navigate: NavigateFunction = prop.navigate
    const [error, setError] = useState<string>("")

    async function buttonOnClick() {
        const newBio = (document.getElementById("change-bio-textfield") as HTMLInputElement).value
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
            <TextField id="change-bio-textfield" label="Bio" defaultValue={user.bio} multiline
                       sx={{ width: "100%", mt: marginTop }} />
            <ErrorText error={error} />
            <Button onClick={buttonOnClick} variant="contained" disableElevation>Change Bio</Button>
        </div>
    )
}

function ChangePassword(prop: any) {
    const navigate: NavigateFunction = prop.navigate
    const [error, setError] = useState<string>("")

    async function buttonOnClick() {
        const password = (document.getElementById("password") as HTMLInputElement).value
        const confirm_password = (document.getElementById("confirm-password") as HTMLInputElement).value
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
                <TextField id="password" label="New Password" type="password"  sx={{ mt: marginTop }}/>
                <TextField id="confirm-password" type="password" label="Confirm New Password" sx={{ mt: "10px" }}/>
            </div>
            <ErrorText error={error}/>
            <Button onClick={buttonOnClick} variant="contained" disableElevation>Change Password</Button>
        </div>
    );
}

function DeleteAccount(prop: any) {
    const user_id = prop.user_id
    const navigate: NavigateFunction = prop.navigate
    const [open, setOpen] = useState<boolean>(false)

    async function buttonOnClick() {
        await fetchWithHeader(`/users/${user_id}`, "DELETE")
        navigate(0)
    }

    return (
        <div className="section-container">
            <p className="section-title-text">Delete Account</p>
            <Button onClick={() => setOpen(true)} sx={{ mt: marginTop }} color="error" variant="contained" disableElevation>Delete Account</Button>
            <Backdrop open={open} onClick={() => setOpen(false)} sx={{ zIndex: 999 }}>
                <div className="section-container">
                    <p className="section-title-text">Warning</p>
                    <p id="warning-body-paragraph">This will PERMANENTLY delete your account with no ways to recover.<br />
                        Are you sure you want to do this?</p>
                    <p style={{ marginTop: "2%" }}>*This will not delete your posts or comments</p>
                    <Button onClick={buttonOnClick} variant="contained" color="error" disableElevation sx={{ mt: "2%" }}>Proceed</Button>
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
            <ChangePassword user_id={user.id} navigate={navigate} />
            <DeleteAccount user_id={user.id} navigate={navigate} />
        </>
    )
}