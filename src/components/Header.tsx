import {
    Accordion, AccordionDetails, AccordionSummary,
    Avatar,
    Button,
    createTheme,
    Grid,
    IconButton,
    InputBase,
    ThemeProvider,
} from "@mui/material";
import default_avatar from "../resources/default_avatar.jpg";
import {Clear, KeyboardArrowDown, Search} from "@mui/icons-material";
import SimpleUser from "../interfaces/SimpleUser";
import parseString from "../helper/parseString";
import {useEffect, useState} from "react";
import signOut from "../helper/signOut";
import {useLocation, useNavigate} from "react-router-dom";
import fetchWithHeader from "../helper/fetchWithHeader";

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

const avatar_size = 44

const themeAccordion = createTheme({
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    padding: 0,
                    margin: 0,
                },
                content: {
                    padding: 0,
                    margin: 0,
                }
            }
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    padding: 0,
                    margin: 0,
                },
            }
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    display: "flex",
                    flexGrow: 1,
                }
            }
        }
    }
})

function UserInfo(prop: any) {
    const user = prop.user
    const navigate = prop.navigate
    return (
        <ThemeProvider theme={themeAccordion}>
            <Accordion elevation={0} disableGutters sx={{ position: "absolute", zIndex: 999}}>
                <AccordionSummary sx={{ margin: 0, padding: 0 }}>
                    <Button id="header-menu-button"
                            startIcon={ <KeyboardArrowDown sx={{ padding: 0 }}/> }>
                        <p id="header-username">{user.username}</p>
                        <Avatar alt={user.username}
                                src={parseString(user.image)}
                                sx={{ height: avatar_size, width: avatar_size }}>
                            <Avatar alt="default"
                                    src={default_avatar}
                                    sx={{ height: avatar_size, width: avatar_size }} />
                        </Avatar>
                    </Button>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="dropdown-options-div">
                        <Button onClick={() => navigate(`/users/${user.id}`)}
                                color="inherit">Profile</Button>
                        <Button color="inherit">My Account</Button>
                        <Button onClick={signOut(navigate)}
                                color="inherit">Logout</Button>
                    </div>
                </AccordionDetails>
            </Accordion>
        </ThemeProvider>
    );
}

function LoginSignInButtons() {
    return (
        <div style={{display: "flex"}}>
            <div style={{flexGrow: 1}}></div>
            <Button variant="contained"
                    disableElevation
                    href="/auth?form=0"
                    sx={{ mr: 1 }}>Login
            </Button>
            <Button variant="contained"
                    disableElevation
                    href="/auth?form=1"
                    sx={{ mr: 2.5 }}>Sign Up
            </Button>
        </div>
    );
}

function Header() {
    let [user, setUser] = useState<SimpleUser | undefined>(undefined)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        fetchWithHeader("http://localhost:5000/user_simple", "GET")
            .then(json => json.status === "success"
                ? setUser(json.data as SimpleUser)
                : setUser({id: -1, username: "_", image: "_"}))
    }, [location]);

    //state === 0 => fetching data
    //state === 1 => not logged in
    //state === 2 => logged in
    const state = user === undefined ? 0 : user.id === -1 ? 1 : 2

    return (
        <header>
            <Grid container alignItems="center" height={60}>
                <Grid item xs={3.5} sx={{ display: "flex", justifyContent: "center" }}>
                    <a id="site-name" href="/" style={{display: "inline"}}>Anarchy</a>
                </Grid>
                <Grid item xs={5}>
                <SearchBar />
                </Grid>
                <Grid item xs={3.5} sx={{ display: "flex", justifyContent: "center", alignSelf: state === 2 ? "start" : "center" }}>
                    {state === 2 ? <UserInfo user={user} navigate={navigate}/> : state === 1 ? <LoginSignInButtons /> : undefined}
                </Grid>
            </Grid>
        </header>
    );
}

export default Header