import { Button, Grid, Stack } from "@mui/material";
import { useEffect, useReducer, useState } from "react"
import { v4 as uuid } from "uuid"


function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const compareSequence = (a: string[], b: string[]) => {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }

    return true;
}

let values = Array(9).fill(null).map(_ => uuid());
let clicks = 0;

const getRandomPosition = () => {
    const i = Math.floor(Math.random() * (values.length + 1));
    
    return values[i];
}

export default function Main() {
    const [currentActive, setCurrentActive] = useState<string | null>(null)
    const [count, setCount] = useState<number>(0);
    const [sequence, setSequence] = useState<string[]>([]);
    const [blocked, setBlocked] = useState(false);

    let clicked: string[] = [];

    const generateSequence = () => {
        const pos = getRandomPosition();

        setSequence([...sequence, pos])
        setCount(count+1);
    }
    
    if (sequence.length == 0) {
        generateSequence();   
    }

    useEffect(() => {        
        (async() => {
            setBlocked(true);

            for(let i in sequence) {
                await delay(400);

                setCurrentActive(sequence[i]);

                await delay(300);
                setCurrentActive(null)
                await delay(300);
            }


            setBlocked(false);
        })();
        
    }, [sequence]);

    const clickHandler = (value: string) => {
        if (blocked) 
            return;

        console.log(clicked)
        
        clicked.push(value)

        if (!compareSequence(clicked, sequence)) {
            clicks = 0;
            clicked = [];
            setCount(0);
            setSequence([]);

            return;
        }

        clicks++;
        
        if (clicks == count) {
            generateSequence();

            clicks = 0;
            clicked = []
        }

    }

    return (
        <>
            <Stack alignItems={"center"} justifyContent={"center"} width={"100vw"}>
                <Grid container spacing={0} width="90%" alignItems={"center"} justifyContent={"center"} maxWidth={"600px"}>

                    {values.map((x) => 
                        <Grid key={x} item xs={4} sx={{aspectRatio: "1/1", border: "1px solid black"}}>
                            <Button
                                sx={{bgcolor: x == currentActive ? "white" : "", height: "100%"}}
                                onClick={(e) => {clickHandler(x); e.currentTarget.blur()}}
                                fullWidth>

                            </Button>
                        </Grid>
                    )}

                </Grid>
            </Stack>
        </>
    )
}