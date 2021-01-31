import React, { useState, Fragment } from "react"
import { createStyles, useTheme, Theme, makeStyles } from "@material-ui/core/styles"
import { Menu, MenuItem, ListItem, ListItemText, ListItemIcon } from "@material-ui/core"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import AppBar from "@material-ui/core/AppBar"
import CssBaseline from "@material-ui/core/CssBaseline"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import {
  MoreVert as MoreIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Event as EventIcon,
} from "@material-ui/icons"
import { Link } from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    appBar: {
      top: "auto",
      bottom: 0,
    },
    toolbar: {
      justifyContent: "space-between",
    },
    grow: {
      flexGrow: 1,
    },
    label: {
      // Aligns the content of the button vertically.
      flexDirection: "column",
    },
    textMenu: {
      textDecoration: "none",
      color: "white",
    },
    icon: {
      justifyContent: "center",
    },
  })
)

const items = [
  { title: "home", href: "/", icon: <HomeIcon /> },
  { title: "planning", href: "/planning", icon: <EventIcon /> },
  { title: "reserve", href: "/reserve", icon: <GroupIcon /> },
  {
    title: "resAuto",
    href: "/reserveAutomatique",
    icon: <ReplayIcon />,
  },
  { title: "profile", href: "/profile", icon: <PersonIcon /> },
  { title: "memberArea", href: "/memberArea", icon: <ArrowBackIcon /> },
]

export default function BottomAppBar() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("xs"))

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (matches) {
    return (
      <Fragment>
        <CssBaseline />
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            {items.map((item) => (
              <Link to={`${item.href}`} key={item.title}>
                <ListItem button className={classes.label}>
                  <ListItemIcon className={classes.icon}> {item.icon}</ListItemIcon>
                  <ListItemText className={classes.textMenu} primary={item.title} />
                </ListItem>
              </Link>
            ))}
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              {items.map((item) => (
                <Link to={`${item.href}`} key={item.title}>
                  <MenuItem className={classes.textMenu} onClick={handleClose}>
                    {item.title}{" "}
                  </MenuItem>
                </Link>
              ))}
            </Menu>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              edge="end"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Fragment>
    )
  } else return <></>
}
