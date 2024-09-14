import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type Card = {
  text: string;
}

export default function Cards ({text}: Card) {
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

  return <Grid item xs={3} key={text}>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          cursor: isDragging ? "grabbing" : "grab"
        }}
      >
        <TextField
        id={text}
        variant="filled"
        multiline
        rows={4}
        value={text}
        fullWidth={true}
        />
      </div>
    </Grid>
}