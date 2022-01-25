import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { createStyles, useTheme, makeStyles } from "@material-ui/core/styles"
import {
  useMediaQuery,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
  AppBar,
  Toolbar,
  IconButton,
} from "@material-ui/core"
import { MoreVert as MoreIcon, Group as GroupIcon, Event as EventIcon, Home as HomeIcon } from "@material-ui/icons"

import { RoleId } from "src/types/model"
import { hasRole } from "src/helpers/role"
import { useUser } from "src/providers/user"

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
    },
    toolbar: {
      justifyContent: "space-between",
    },
    label: {
      // Aligns the content of the button vertically.
      flexDirection: "column",
    },
    menu: {
      "& ul": {
        paddingTop: "0 !important",
        paddingBottom: "0 !important",
      },
    },
    textMenuDecoration: {
      textDecoration: "none",
    },
    menuItem: {
      color: "rgba(255, 255, 255, 0.54)",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    activeItem: {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    icon: {
      justifyContent: "center",
      "& svg": {
        fill: "rgba(255, 255, 255, 0.54)",
      },
    },
    activeIcon: {
      justifyContent: "center",
      "& svg": {
        fill: "white",
      },
    },
  })
)

const MAIN_ITEMS = [
  { title: "Accueil", href: "/home", Icon: HomeIcon, role: RoleId.Chouettos },
  { title: "Planning", href: "/planning", Icon: EventIcon, role: RoleId.Chouettos },
  { title: "Réserve", href: "/reserve", Icon: GroupIcon, role: RoleId.Chouettos },
]
const EXTRA_ITEMS = [
  //{ title: "Auto", href: "/auto", role: RoleId.Chouettos },
  { title: "Mon profil", href: "/profile", role: RoleId.Chouettos },
  { title: "Historique des PIAF", href: "/history", role: RoleId.Chouettos },
  { title: "Espace membre", href: "/member", role: RoleId.Chouettos },
  { title: "Groupe MAG", href: "/magasin", role: RoleId.AdminMag },
  { title: "Groupe BdM", href: "/bdm", role: RoleId.AdminBdM },
]

export default function BottomAppBar() {
  const classes = useStyles()
  const { user, logout } = useUser<true>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const { pathname } = useLocation()
  const matches = useMediaQuery(theme.breakpoints.down("xs"))

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const userRoles = user?.rolesChouette || []

  if (!matches) {
    return null
  }

  return (
    <>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {MAIN_ITEMS.filter(({ role }) => hasRole(role, userRoles)).map(({ href, title, Icon }) => {
            const active = pathname === href
            return (
              <ListItem button className={classes.label} key={title} component={Link} to={href}>
                <ListItemIcon className={active ? classes.activeIcon : classes.icon}>
                  <Icon />
                </ListItemIcon>
                <ListItemText className={active ? classes.activeItem : classes.menuItem} primary={title} />
              </ListItem>
            )
          })}
          <Menu
            id="simple-menu"
            className={classes.menu}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {EXTRA_ITEMS.filter(({ role }) => hasRole(role, userRoles)).map(({ href, title }) => {
              const active = pathname === href
              return (
                <MenuItem
                  key={title}
                  className={active ? classes.activeItem : classes.menuItem}
                  onClick={handleClose}
                  component={Link}
                  to={href}
                >
                  {title}
                </MenuItem>
              )
            })}

            <MenuItem onClick={logout} key="Logout" className={classes.menuItem} color="inherit">
              Déconnexion
            </MenuItem>
          </Menu>
          <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} edge="end" color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}
