import { useState } from "react"
import { useLocation } from "react-router"
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
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Chip,
  Tooltip,
} from "@material-ui/core"
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  // Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Event as EventIcon,
  EventNote as EventNoteIcon,
  Storefront as StorefrontIcon,
  CardMembership as CardMembershipIcon,
  History as HistoryIcon,
} from "@material-ui/icons"

import Link from "src/components/Link"
import { useUser } from "src/providers/user"
import { hasAtLeastOneRole } from "src/helpers/role"
import { TEST } from "src/helpers/apollo"
import { formatName } from "src/helpers/user"
import { RoleId } from "src/types/model"

const DRAWER_WIDTH = 260

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
    menuItem: {
      textDecoration: "none",
      color: theme.palette.secondary.main,
    },
    activeItem: {
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
  })
)

const ITEMS = [
  { title: "Accueil", href: "/home", Icon: HomeIcon, roles: [RoleId.Chouettos] },
  { title: "Planning", href: "/planning", Icon: EventIcon, roles: [RoleId.Chouettos, RoleId.PosteAccueil] },
  { title: "Réserve", href: "/reserve", Icon: GroupIcon, roles: [RoleId.Chouettos] },
  /* {
    title: "Réservation automatique",
    href: "/auto",
    Icon: ReplayIcon,
    roles: [RoleId.Chouettos],
  },*/
  { title: "Mon profil", href: "/profile", Icon: PersonIcon, roles: [RoleId.Chouettos] },
  { title: "Historique des PIAF", href: "/history", Icon: HistoryIcon, roles: [RoleId.Chouettos] },
  { title: "Groupe MAG", href: "/magasin", Icon: StorefrontIcon, roles: [RoleId.AdminMag] },
  { title: "Groupe BdM", href: "/bdm", Icon: CardMembershipIcon, roles: [RoleId.AdminBdM] },
  { title: "Planning BdM", href: "/planning-bdm", Icon: EventNoteIcon, roles: [RoleId.AdminBdM] },
  {
    title: "Espace membre",
    href: "https://espace-membres.lachouettecoop.fr/page/homepage",
    Icon: ArrowBackIcon,
    roles: [RoleId.Chouettos],
  },
]

const Menu = () => {
  const classes = useStyles()
  const { user, logout } = useUser<true>()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  if (!matches) {
    return null
  }

  const userRoles = user?.rolesChouette || []

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
            Planning {TEST && <Chip label="TEST" />}
          </Typography>
          <Spacer />
          <PersonIcon />
          {user && formatName(user)}
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
        <List>
          {ITEMS.filter(({ roles }) => hasAtLeastOneRole(roles, userRoles)).map(({ href, title, Icon }) => {
            const active = pathname === href
            return (
              <Link className={active ? classes.activeItem : classes.menuItem} href={href} key={href}>
                <Tooltip title={title}>
                  <ListItem button>
                    <ListItemIcon>
                      <Icon color={active ? "primary" : "secondary"} />
                    </ListItemIcon>
                    <ListItemText primary={title} />
                  </ListItem>
                </Tooltip>
              </Link>
            )
          })}
        </List>
      </Drawer>
    </div>
  )
}

export default Menu
