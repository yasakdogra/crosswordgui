// import { createStore } from "solid-js/store";

// export type HintData = [number, number, number, boolean, string][]

// export const [state, setState] = createStore<{
//     rows: number,
//     columns: number,
//     grid: string[][],

//     hints: HintData,

//     active: {
//         row: number,
//         column: number,
//         across: boolean,
//         hint: number,
//     }
// }>({
//     rows: 5,
//     columns: 5,
//     grid: Array.from(Array(5).keys()).map(() => Array.from(Array(5).keys()).map(() => "")),

//     hints: [],

//     active: {
//         row: 0,
//         column: 0,
//         across: true,
//         hint: 0,
//     },
// });