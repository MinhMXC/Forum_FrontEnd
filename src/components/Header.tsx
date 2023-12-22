import {
    Avatar,
    Button,
    createTheme,
    Grid,
    IconButton,
    InputBase,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import {Clear, Delete, KeyboardArrowDown, Search} from "@mui/icons-material";
import convertEpochToTimeAgo from "../helper/convertEpochToTimeAgo";
import SimpleUser from "../interfaces/SimpleUser";
import parseString from "../helper/parseString";

const user: SimpleUser = {
    id: 1,
    username: "MinhMXC",
    image: ""
}

function PageNameLogo() {
    return (
        <Grid container alignItems="center" ml={5}>
            <Grid item xs="auto">
                <p id="site-name" style={{display: "inline"}}>Anarchy</p>
            </Grid>
        </Grid>
    );
}

const searchBarTheme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    paddingLeft: 10,
                },
                root: {
                    backgroundColor: "#f6f6f6",
                    borderRadius: 7,
                    padding: 5
                }
            }
        }
    }
})

function SearchBar() {
    return (
        <ThemeProvider theme={searchBarTheme}>
            <InputBase
                startAdornment={ <IconButton sx={{ padding: 0.5 }}><Search /></IconButton> }
                endAdornment={ <IconButton sx={{ padding: 0.5 }}><Clear /></IconButton> }
                placeholder="Search"
                fullWidth={true}
                type="search"
            />
        </ThemeProvider>
    );
}

function UserInfo(user: SimpleUser) {
    return (
        <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 1 }}></div>
            <Button id="header-menu-button" startIcon={ <KeyboardArrowDown sx={{ padding: 0 }} /> }>
                <p id="header-username">{user.username}</p>
                <Avatar alt={user.username} src={parseString(user.image)} sx={{ height: 36, width: 36 }}>
                    <Avatar alt="default" src={default_avatar} />
                </Avatar>
            </Button>
        </div>
    );
}

function Header() {
    return (
        <header>
            <Grid container alignItems="center" height={60}>
                <Grid item xs={3.5}>
                    <PageNameLogo />
                </Grid>
                <Grid item xs={5}>
                    <SearchBar />
                </Grid>
                <Grid item xs={3.5}>
                    <UserInfo {...user} />
                </Grid>
            </Grid>
        </header>
    );
}

export default Header