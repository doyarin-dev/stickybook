import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShelfIcon from '@mui/icons-material/Style';
import { DndContext, closestCenter ,DragOverlay} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import Grid from '@mui/material/Grid';
import Cards from './Card';


// export const mainListItems = (
export function MainListItems(){
  const [displayCards, setDisplayCards] = React.useState<string[]>([]);
  const [activeId, setActiveId] = React.useState(null);
  return (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <ShelfIcon />
      </ListItemIcon>
      <ListItemText primary="Shelf1" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShelfIcon />
      </ListItemIcon>
      <ListItemText primary="Shelf2" />
    </ListItemButton>
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const {active, over} = event;
        if (over == null || active.id === over.id) {
          return
        }
        const oldIndex = displayCards.findIndex((item) => item === active.id)
        const newIndex = displayCards.findIndex((item) => item === over.id)
        const newItems = arrayMove(displayCards, oldIndex, newIndex)
        setDisplayCards(newItems)
      }}
    >
      <Grid container spacing={2}>
        <SortableContext items={displayCards}>  
          {
            displayCards.map((cardText) => {
              return <Cards text={cardText}/>
            })
          }
        </SortableContext>
        <DragOverlay>
          {activeId ? <Cards text="1" /> : null}
        </DragOverlay>
      </Grid>
    </DndContext>
  </React.Fragment>
  )
};

export const SecondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);