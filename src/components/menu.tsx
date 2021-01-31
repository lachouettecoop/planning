import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@apollo/client"
import clsx from "clsx"
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles"
import {
  styled,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
} from "@material-ui/core"
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Event as EventIcon,
} from "@material-ui/icons"

import { useUser } from "src/providers/user"
import { LOGGED_IN_USER } from "src/graphql/queries"
import apollo from "src/helpers/apollo"
import { User } from "src/types/model"

const DRAWER_WIDTH = 240

const Spacer = styled(Box)({
  flexGrow: 1,
})

const useStyles = makeStyles((theme) =>
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
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
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
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: DRAWER_WIDTH,
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

type Result = { user: User }

const ITEMS = [
  { title: "Accueil", href: "/", Icon: HomeIcon },
  { title: "Planning", href: "/planning", Icon: EventIcon },
  { title: "Réserve", href: "/reserve", Icon: GroupIcon },
  {
    title: "Réservation automatique",
    href: "/auto",
    Icon: ReplayIcon,
  },
  { title: "Mon profil", href: "/profile", Icon: PersonIcon },
  { title: "Espace membre", href: "/member", Icon: ArrowBackIcon },
]

const Menu = () => {
  const classes = useStyles()
  const { user, logout } = useUser()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const matches = useMediaQuery(theme.breakpoints.up("sm"))

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const { data } = useQuery<Result>(LOGGED_IN_USER, {
    variables: { id: `/api/users/${user?.id}` },
    client: apollo,
  })

  if (!matches) {
    return null
  }

  return (
    <div className={classes.root}>
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
      <Toolbar />
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
            <PersonIcon />
          </ListItemIcon>
          {data && <ListItemText primary={`${data.user.prenom} ${data.user.nom}`} />}
        </ListItem>
        <Divider />
        <List>
          {ITEMS.map(({ href, title, Icon }) => (
            <Link to={href} key={href}>
              <ListItem button>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </div>
  )
}

export default Menu
