import React, { useState, Fragment } from "react"
import { Link } from "react-router-dom"
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
import {
  MoreVert as MoreIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Replay as ReplayIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  // Home as HomeIcon,
} from "@material-ui/icons"

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
    textMenuDecoration: {
      textDecoration: "none",
    },
    textMenu: {
      color: "white",
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
      backgroundColor: theme.palette.primary.main, //TODO
    },
    icon: {
      justifyContent: "center",
    },
  })
)

const MAIN_ITEMS = [
  { title: "Planning", href: "/planning", Icon: EventIcon },
  { title: "Réserve", href: "/reserve", Icon: GroupIcon },
  { title: "Auto", href: "/auto", Icon: ReplayIcon },
]
const EXTRA_ITEMS = [
  // { title: "home", href: "/", Icon: HomeIcon },
  { title: "Mon profil", href: "/profile", Icon: PersonIcon },
  { title: "Espace membre", href: "/member", Icon: ArrowBackIcon },
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

  if (!matches) {
    return null
  }

  return (
    <Fragment>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {MAIN_ITEMS.map(({ href, title, Icon }) => (
            <Link className={classes.textMenuDecoration} to={href} key={title}>
              <ListItem button className={classes.label}>
                <ListItemIcon className={classes.icon}>
                  <Icon />
                </ListItemIcon>
                <ListItemText className={classes.textMenu} primary={title} />
              </ListItem>
            </Link>
          ))}
          <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            {EXTRA_ITEMS.map((item) => (
              <Link className={classes.textMenuDecoration} to={item.href} key={item.title}>
                <MenuItem className={classes.textMenu} onClick={handleClose}>
                  {item.title}
                </MenuItem>
              </Link>
            ))}
          </Menu>
          <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} edge="end" color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Fragment>
  )
}
