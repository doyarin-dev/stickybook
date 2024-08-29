import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Deposits from './Deposits';
import Orders from './Orders';
import { AddCard } from '@mui/icons-material';
// import Card from './Card';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

class Card {
  private _text: string
  constructor(text: string) {
    this._text = text
  }
  get text() {
    return this._text
  }
  set text(text: string) {
    this._text = text
  }
}

class Cards {
  private _cards: Card[]
  constructor(cards: Card[]) {
    this._cards = cards
  }
  getCard(cardNumber: number){
    return this._cards[cardNumber]
  }
  getCardNumber(){
    return this._cards.length;
  }
  get cards(){
    return this._cards
  }
  addCard(cardText: string){
    return new Cards(this._cards.concat(new Card(cardText)))
  }
  updateCard(cardNumber: number, text: string){
    return new Cards(this._cards.map((card, index) => {
      return index === cardNumber ? new Card(text) : card
    }))
  }
  removeCard(cardNumber: number){
    this._cards.splice(cardNumber)
  }
}

export default function Dashboard() {
  const localStorageKeyName = 'card';

  const setCardsToLocalStorage = (Cards: Cards, localStorageKeyName: string) => {
    let textList = Cards.cards.map(card => card.text)
    localStorage.setItem(localStorageKeyName, JSON.stringify(textList));
  }

  const getCardsFromLocalStorage = (localStorageKeyName: string) => {
    let textList = JSON.parse(localStorage.getItem(localStorageKeyName) || 'null')
    if (Array.isArray(textList)){
      return new Cards(textList.map(text => new Card(text)))
    }
    return new Cards([])
  }

  const [displayCards, setDisplayCards] = React.useState<Cards>(getCardsFromLocalStorage(localStorageKeyName));
  // const displayCardNumber:number = newCard.getCardNumber();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const addNewCard = () => {
    setDisplayCards(displayCards.addCard(''))
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              StickyBook
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <IconButton aria-label="delete" size="large" onClick={addNewCard}>
              <AddCircleIcon fontSize="inherit" />
            </IconButton>
            <Grid container spacing={2}>
              {
                displayCards.cards.map((card,index) => {
                  return <Grid item xs={3}>
                  <TextField
                    id="hoge"
                    variant="filled"
                    multiline
                    rows={4}
                    value={card.text}
                    onChange={(event) => {
                      const inputText = event.target.value
                      const newCards = displayCards.updateCard(index, inputText)
                      setCardsToLocalStorage(newCards, localStorageKeyName)
                      setDisplayCards(newCards)
                    }}
                    fullWidth={true}
                  /></Grid>
                })
              }
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}