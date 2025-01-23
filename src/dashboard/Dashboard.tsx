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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { MainListItems, SecondaryListItems } from './listItems';
import { AddCard } from '@mui/icons-material';
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import Cards from './Card';
import { Droppable } from './Shelf ';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('body')

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

export default function Dashboard() {
  let subtitle: HTMLHeadingElement | null;
  // let modalIndex : number = 0;
  const [modalIndex, setModalIndex] = React.useState<number>(0);
  const [modalIsOpen, setIsOpen] = React.useState<boolean>(false);

  function openModal(index:number) {
    setIsOpen(true);
    setModalIndex(index)
    console.log("これはopenModal",modalIndex,index)
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    if (subtitle) subtitle.style.color = '#f00'
}

  function closeModal() {
    setIsOpen(false);
  }

  const localStorageKeyName = 'card';
  const setCardsToLocalStorage = (Cards: string[], localStorageKeyName: string) => {
    localStorage.setItem(localStorageKeyName, JSON.stringify(Cards));
  }
  const getCardsFromLocalStorage = (localStorageKeyName: string) => {
    let textList = JSON.parse(localStorage.getItem(localStorageKeyName) || 'null')
    if (Array.isArray(textList)){
      return  textList
      // new Cards(textList.map(text => new Card(text)))
    }
    return []
  }

  // const [displayCards, setDisplayCards] = React.useState<string[]>([]);
  const [displayCards, setDisplayCards] = React.useState<string[]>(getCardsFromLocalStorage(localStorageKeyName));

  // const displayCardNumber:number = newCard.getCardNumber();
  const [open, setOpen] = React.useState(true);
  const [activeId, setActiveId] = React.useState(null);
  const [dropCount, setDropCount] = React.useState(0);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const addNewCard = () => {
    const randomnum=Math.random().toString(32).substring(2)
    setDisplayCards([...displayCards, randomnum])
    console.log(displayCards)
    setCardsToLocalStorage([...displayCards,randomnum], localStorageKeyName)
  };
  const deleteCard = (index:number) => {
    console.log(index,"hoge")
    const newCards = displayCards.filter((_,i) => i !== index);
    setDisplayCards(newCards);
    setCardsToLocalStorage(newCards, localStorageKeyName)
    } 
  // const editCard =() 
  function deleteAndCloseModal(index:number){
    console.log(index,"hage")
    closeModal()
    deleteCard(index)
  }


  const MainBookShelf = MainListItems();
  function handleDragStart(event:any) {
    setActiveId(event.active.id);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={(event) => {
          const {active, over} = event;
          if (over == null || active.id === over.id) {
            return
          }
          const oldIndex = displayCards.findIndex((item) => item === active.id)
          const newIndex = displayCards.findIndex((item) => item === over.id)
          const newItems = arrayMove(displayCards, oldIndex, newIndex)
          setDisplayCards(newItems)
          setDropCount((x)=> x+1)
        }}
        >
          <Box 
          style = {{zIndex : 0}}
          >
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
              <Droppable id="shelf1">
                {MainBookShelf}
                {dropCount}回ドロップしたよー
              </Droppable>
              <Divider sx={{ my: 1 }} />
              {SecondaryListItems}
            </List>
          </Drawer>
          </Box>
          <Box
            component="main"
            // style={{ zIndex: 10 }}
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
                    <SortableContext items={displayCards}>  
                      {
                        displayCards.map((cardText,index) => {
                          return( 
                          <>
                          <Cards text={cardText}/>
                          <div>
                          <DeleteForeverIcon onClick={() => openModal(index)}/>
                          </div>
                          {/* <button {(event: React.MouseEvent<SVGSVGElement>) => handleClick(index)} > */}
                          </>
                          )
                        })
                      }
                    </SortableContext>
                  </Grid>
                    <DragOverlay>
                      {/* <Cards text={"1"} /> */}
                      {activeId ? (
                        <Cards text={activeId} />
                      ): null}
                    </DragOverlay>
              </Container>
          </Box>
        </DndContext>
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        <button onClick={()=> deleteAndCloseModal(modalIndex)} >Delete</button>
      </Modal>
    </ThemeProvider>
  );
}