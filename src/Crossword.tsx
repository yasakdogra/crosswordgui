import { createContext, JSX, useContext } from "solid-js";

// Clue : [row, column, length, across, text]
export type ClueType = [number, number, number, boolean, string];

export type CrosswordContextType = {
    solution: string,
    clues: ClueType[],
    letters: string[][],
    grid: number[][][],
    activeRow : number,
    activeCol : number,
    activeAcross : boolean,
    activeClueIndex : number,
};


export const CrosswordProvider = (props: { value: CrosswordContextType, children: JSX.Element }) => {
    return <CrosswordContext.Provider value={props.value}>
        {props.children}
    </CrosswordContext.Provider>
};

export const CrosswordContext = createContext<CrosswordContextType>();

export function useCrossword() { return useContext(CrosswordContext); }