import React from "react"
import clsx from "clsx"
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import List from "@material-ui/core/List"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import GroupIcon from "@material-ui/icons/Group"
import PersonIcon from "@material-ui/icons/Person"
import ReplayIcon from "@material-ui/icons/Replay"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import HomeIcon from "@material-ui/icons/Home"
import EventIcon from "@material-ui/icons/Event"
import { styled, Button, Box } from "@material-ui/core"
import { useUser } from "src/providers/user"
import { Link } from "react-router-dom"
import { LOGGED_IN_USER } from "../graphql/queries"
import apollo from "src/helpers/apollo"
import { getStoredUser } from "src/providers/user"
import { User } from "src/types/model"
import { useState, useEffect } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const drawerWidth = 240

const Spacer = styled(Box)({
  flexGrow: 1,
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
)

const Menu = () => {
  const classes = useStyles()
  const { logout } = useUser()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  type Result = { user: User }
  const [user, setUser] = useState<Result>()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
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

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const getUser = async () => {
    try {
      const storedUser = getStoredUser()
      const { data } = await apollo.query<Result>({
        query: LOGGED_IN_USER,
        variables: { id: `/api/users/${storedUser?.id}` },
      })
      setUser(data)
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    getUser()
  })

  if (matches) {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Planning
            </Typography>
            <Spacer />
            <Button onClick={logout} color="inherit">
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              {" "}
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={`${user?.user.prenom} ${user?.user.nom}`} />
          </ListItem>
          <Divider />
          <List>
            {items.map((item) => (
              <Link to={`${item.href}`} key={item.title}>
                <ListItem button>
                  <ListItemIcon> {item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
      </div>
    )
  } else return <></>
}

export default Menu
