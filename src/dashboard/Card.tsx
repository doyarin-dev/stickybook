import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as React from 'react';
import CreateIcon from '@mui/icons-material/Create';
import { CardModal } from './modal';

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


export type Card = {
  text: string;
}

export default function Cards ({text}: Card) {
  /* Card/Cards variable extentions is below, so we can change 
  type Card = {
  number: string;
  expiryDate: string;
  owner: string;
  };

  const Cards: { text: Card } = {
    text: {
      number: "1234-5678-9012-3456",
      expiryDate: "12/25",
      owner: "Taro Yamada",
    },
  };
  */
  const {
    isDragging,
    // 並び替えのつまみ部分に設定するプロパティ
    attributes,
    listeners,
    // DOM全体に対して設定するプロパティ
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: text });
  const [displayCards, setDisplayCards] = React.useState<string[]>(getCardsFromLocalStorage(localStorageKeyName));
  

  return (
    <Grid item xs={3} key={text}>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          cursor: isDragging ? "grabbing" : "grab",
          opacity: isDragging ? 0 :1
        }}
      >
        <TextField
        id="1"
        variant="filled"
        multiline
        rows={4}
        value={text}     
        onChange={(event) => {
          const inputText = event.target.value
          // const newCards = displayCards.updateCard(index, inputText)
          setDisplayCards([...displayCards, inputText])
          setCardsToLocalStorage(displayCards, localStorageKeyName)
        }}
        fullWidth={true}
        />
        <CreateIcon style = {{zIndex : 99}}onClick = {() => console.log("hoge")} />
      </div>
        <CardModal/>
    </Grid>
  )
}