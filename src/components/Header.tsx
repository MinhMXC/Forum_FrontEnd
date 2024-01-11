import {
    Accordion, AccordionDetails, AccordionSummary, Autocomplete,
    Button, Chip,
    createTheme,
    Grid,
    IconButton,
    InputBase, Menu, MenuItem, TextField,
    ThemeProvider,
} from "@mui/material";
import {Clear, KeyboardArrowDown, KeyboardArrowUp, Search, Tune} from "@mui/icons-material";
import SimpleUser from "../interfaces/SimpleUser";
import React, {useEffect, useState} from "react";
import signOut from "../helper/signOut";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import fetchWithHeader from "../helper/fetchWithHeader";
import handleEnterKey from "../helper/handleEnterKey";
import Tag from "../interfaces/Tag";
import textChipColour from "../helper/textChipColour";
import UserAvatar from "./UserAvatar";
import APP_CONSTANTS from "../helper/ApplicationConstants";
import getTextFieldValue from "../helper/getTextFieldValue";

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

let advancedSearchPopUpTheme = createTheme()
advancedSearchPopUpTheme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                   [advancedSearchPopUpTheme.breakpoints.up("sm")]: {
                       width: "41%"
                   },
                   [advancedSearchPopUpTheme.breakpoints.down("sm")]: {
                       width: "100%"
                   }
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    width: "100%",
                    padding: 0
                }
            }
        }
    }
})

const tagSelectionTheme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    width: "100%"
                }
            }
        },
    }
})

function TagSelection(props: {
    setSelected: Function
}) {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        fetchWithHeader("/tags", "GET").then(res => setTags(res.data))
    }, []);

    return (
        <Autocomplete
            multiple
            options={tags}
            onChange={(_, tags) => props.setSelected(tags)}
            getOptionLabel={(option: Tag) => option.tag_text}
            renderInput={(params) => (
                <TextField {...params} label="Tags" onKeyDown={(e: any) => e.stopPropagation()} />
            )}
            renderTags={(value, getTagProps) =>
                value.map((tag: Tag, index: number) =>
                    (<Chip
                        variant="filled"
                        label={tag.tag_text}
                        sx={{ background: tag.colour, color: textChipColour(tag.colour) }}
                        {...getTagProps({ index })}
                    />))
            }
        />
    );
}

function SearchBar(props: {
    navigate: NavigateFunction
}) {
    const navigate = props.navigate
    const [value, setValue] = useState<string>("")
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: any) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    function searchOnClick() {
        navigate(`/?search=${value.toLowerCase()}`)
    }

    function advancedSearchOnClick() {
        const title = getTextFieldValue("search-title").toLowerCase()
        const body = getTextFieldValue("search-body")
        const tags = selectedTags
                            .map(tag => tag.tag_text)
                            .reduce((x, y) => x === "" ? y : x + "," + y, "")
        handleClose()
        navigate(`/?title=${title}&body=${body}&tags=${tags}`)
    }

    function onKeyDown(e: any) {
        e.stopPropagation()
        if (e.key === "Enter") {
            advancedSearchOnClick()
        }
    }

    return (
        <>
            {/* Search bar*/}
            <ThemeProvider theme={searchBarTheme}>
                <InputBase
                    id="search-bar"
                    startAdornment={
                    <>
                        <IconButton onClick={handleClick}><Tune /></IconButton>
                        <IconButton onClick={searchOnClick} sx={{padding: 0.5}}>
                           <Search/>
                        </IconButton>
                    </>
                    }
                    endAdornment={
                        <IconButton onClick={() => setValue("")} sx={{padding: 0.5}}>
                            <Clear/>
                        </IconButton>
                    }
                    placeholder="Scope: All Posts"
                    fullWidth={true}
                    type="search"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleEnterKey(searchOnClick)}
                />
            </ThemeProvider>

            {/*Search Advanced*/}
            <ThemeProvider theme={advancedSearchPopUpTheme}>
                <Menu
                    elevation={2}
                    anchorEl={anchorEl}
                    open={open}
                    disableAutoFocusItem
                    onClose={handleClose}
                    sx={{ overflow: "show" }}
                >
                    <div className="main-textfields" style={{ padding: "1%" }}>
                        <p style={{ fontSize: "150%", fontWeight: 500, margin: "1%" }}>Advanced Post Search</p>
                        <TextField id="search-title" label="Title" onKeyDown={onKeyDown} />
                        <TextField id="search-body" label="Body" onKeyDown={onKeyDown} />
                        <ThemeProvider theme={tagSelectionTheme}>
                            <TagSelection setSelected={setSelectedTags} />
                        </ThemeProvider>
                        <Button variant="contained" disableElevation onClick={advancedSearchOnClick}>
                            Search
                        </Button>
                    </div>
                </Menu>
            </ThemeProvider>
        </>
    );
}

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

function UserInfo(props: {
    user: SimpleUser,
    navigate: NavigateFunction
}) {
    const user = props.user
    const navigate = props.navigate
    const [expanded, setExpanded] = useState<boolean>(false)

    const startIcon = expanded
                      ? <KeyboardArrowUp sx={{ padding: 0 }}/>
                      : <KeyboardArrowDown sx={{ padding: 0 }}/>

    function profileOnClick() {
        setExpanded(false)
        navigate(`/users/${user.id}`)
    }

    function myAccountOnClick() {
        setExpanded(false)
        navigate("my_account")
    }

    return (
        <ThemeProvider theme={themeAccordion}>
            <Accordion
                elevation={0}
                expanded={expanded}
                disableGutters sx={{ position: "absolute", zIndex: 999}}
            >
                <AccordionSummary sx={{ margin: 0, padding: 0 }}>
                    <Button
                        id="header-menu-button"
                        onClick={() => setExpanded(!expanded)}
                        startIcon={startIcon}
                    >
                        <p id="header-username">{user.username}</p>
                        <UserAvatar user={user} size={APP_CONSTANTS.AVATAR_HEADER} />
                    </Button>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="dropdown-options-div">
                        <Button onClick={profileOnClick} color="inherit">Profile</Button>
                        <Button onClick={myAccountOnClick} color="inherit">My Account</Button>
                        <Button onClick={signOut(navigate)} color="inherit">Logout</Button>
                    </div>
                </AccordionDetails>
            </Accordion>
        </ThemeProvider>
    );
}

function LoginSignInButtons(props: {
    isSmallerScreen: boolean
}) {
    return (
        <div style={{display: "flex"}}>
            <div style={{flexGrow: 1}}></div>
            <Button
                variant="contained"
                disableElevation
                href="/auth?form=0"
                sx={{ mr: 1 }}
            >Login</Button>
            {
            !props.isSmallerScreen &&
                <Button
                    variant="contained"
                    disableElevation
                    href="/auth?form=1"
                >Sign Up</Button>
            }
        </div>
    );
}

function UserInfoSmall(prop: {
    user: SimpleUser,
    navigate: NavigateFunction
}) {
    const user = prop.user
    const navigate = prop.navigate
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: any) => setAnchorEl(event.currentTarget)
    const handleClose = () => {setAnchorEl(null)}

    const profileOnClick = () => {
        handleClose()
        navigate(`/users/${user.id}`)
    }

    const myAccountOnClick = () => {
        handleClose()
        navigate("/my_account")
    }

    const logOutOnClick = () => {
        handleClose()
        signOut(navigate)()
    }

    return (
        <>
            <div onClick={handleClick}>
                <UserAvatar
                    user={user}
                    size={APP_CONSTANTS.AVATAR_HEADER}
                />
            </div>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "right"}}
            >
                <MenuItem onClick={profileOnClick} color="inherit">Profile</MenuItem>
                <MenuItem onClick={myAccountOnClick} color="inherit">My Account</MenuItem>
                <MenuItem onClick={logOutOnClick} color="inherit">Logout</MenuItem>
            </Menu>
        </>
    )
}

export default function Header() {
    let [user, setUser] = useState<SimpleUser>()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        fetchWithHeader("/user_simple", "GET")
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
            <Grid id="large-screen-header" container alignItems="center" height={60}>
                <Grid item sm={3.5} sx={{ display: "flex", justifyContent: "center" }}>
                    <a id="site-name" href="/">Anarchy</a>
                </Grid>
                <Grid item sm={5} id="search-bar-container">
                    <SearchBar navigate={navigate} />
                </Grid>
                <Grid item sm={3.5}
                      sx={{ display: "flex", justifyContent: "center", alignSelf: state === 2 ? "start" : "center" }}>
                    {
                        user === undefined
                        ? undefined
                        : state === 2
                        ? <UserInfo user={user} navigate={navigate} />
                        : state === 1
                        ? <LoginSignInButtons isSmallerScreen={false} />
                        : undefined
                    }
                </Grid>
            </Grid>

            <Grid id="small-screen-header" container alignItems="center" height={60}>
                <Grid item xs id="search-bar-container" sx={{ mr: 1 }}>
                    <SearchBar navigate={navigate} />
                </Grid>
                <Grid item xs="auto" sx={{ mr: 1 }}>
                    {
                        user === undefined
                        ? undefined
                        : state === 2
                        ? <UserInfoSmall user={user} navigate={navigate} />
                        : state === 1
                        ? <LoginSignInButtons isSmallerScreen={true} />
                        : undefined
                    }
                </Grid>
            </Grid>
        </header>
    );
}