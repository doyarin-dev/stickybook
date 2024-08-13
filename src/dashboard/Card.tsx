import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const localStorageKeyName = 'card';

const getCardText = (num: number) => {
    const cardValue = JSON.parse(localStorage.getItem(localStorageKeyName) || 'null');
    if (Array.isArray(cardValue) && cardValue.length > num && cardValue[num].hasOwnProperty('text')){
        return cardValue[num]['text'];
    }
    return '';
};

const setCardText = (num: number, text: string) => {
    let cardValue = JSON.parse(localStorage.getItem(localStorageKeyName) || 'null');
    if (!Array.isArray(cardValue)){
        cardValue = new Array();
    }
    if (cardValue.length <= num){
        while (cardValue.length < num){
            cardValue.push({'text': ''});
        }
        cardValue.push({'text': text});
    } else {
        cardValue[num]['text'] = text;
    }
    localStorage.setItem(localStorageKeyName, JSON.stringify(cardValue));
}
const addCard = () => {
const numExistCards = components.length;
const newComponent = <Card cardNumber={numExistCards}/>;
setComponents([...components, newComponent]);
}

export default function Card({cardNumber}: {cardNumber: number}) {
    const [text, setText] = React.useState<string>(getCardText(cardNumber) || '');
    return (
        <Grid item xs={3}><TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            defaultValue=''
            value={text}
            onChange={(event) => {
                const inputText = event.target.value
                setCardText(cardNumber, inputText)
                setText(inputText)
            }}
        /></Grid>
    )
}