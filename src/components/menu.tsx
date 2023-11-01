import { useState } from "react"
import { useLocation } from "react-router"
import clsx from "clsx"
import { createStyles, makeStyles } from "@mui/styles"
import { Theme, useTheme, CSSObject } from "@mui/material/styles"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MuiDrawer from "@mui/material/Drawer"
import {
  styled,
  useMediaQuery,
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
} from "@mui/material"
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
  Storefront as StorefrontIcon,
  CardMembership as CardMembershipIcon,
  History as HistoryIcon,
} from "@mui/icons-material"

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    menuItem: {
      textDecoration: "none",
      color: theme.palette.secondary.main,
    },
    activeItem: {
      textDecoration: "none",
      color: theme.palette.primary.main,
    },
  }),
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
  {
    title: "Espace membre",
    href: "https://espace-membres.lachouettecoop.fr/page/homepage",
    Icon: ArrowBackIcon,
    roles: [RoleId.Chouettos],
  },
]

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))

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
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
            size="large"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} size="large">
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
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
    </Box>
  )
}

export default Menu
