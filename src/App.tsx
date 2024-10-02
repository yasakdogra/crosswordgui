import './App.css';

import { createEffect, createMemo, createResource, createSignal, For, Match, on, Show, Switch } from "solid-js"
import { createStore, modifyMutable, produce } from 'solid-js/store';
import { ClueType, CrosswordContextType, CrosswordProvider, useCrossword } from './Crossword';
import { Portal } from 'solid-js/web';

type APIResponse = {
    Rows: number,
    Columns: number,
    Grid: string,
    Across: [number, number, number, string][],
    Down: [number, number, number, string][]
}
const data0 = {
    "Rows": 5,
    "Columns": 5,
    "Grid": "REVQLS1PSUxFUk9SSUJJQkVTT00tLVNOWQ==",
    "Across": [
        [0, 0, 3, "Short for department"],
        [1, 0, 5, "A worker on a ship or a vessel lubricator"],
        [2, 0, 5, "A small African antelope"],
        [3, 0, 5, "A type of broom"],
        [4, 2, 3, "A slight curvature of a ship's planking planking plankingplanking planking planking plankingplanking planking"]
    ],
    "Down": [
        [0, 0, 4, "A slang term for a marijuana cigarette"],
        [0, 1, 4, "The Irish name for Ireland"],
        [0, 2, 5, "Fabric finish associated with crinkling"],
        [1, 3, 4, "A poetic term for black or dark"],
        [1, 4, 4, "Covered with frost"]
    ]
}

const data1 = {
    "Rows": 5,
    "Columns": 5,
    "Grid": "Qk0tVU1ZTy1QT1JTLVVST0UtUEFOUy1BVA==",
    "Across": [
        [0, 0, 2, "BM"
        ],
        [0, 3, 2, "UM"
        ],
        [1, 0, 2, "YO"
        ],
        [1, 3, 2, "PO"
        ],
        [2, 0, 2, "RS"
        ],
        [2, 3, 2, "UR"
        ],
        [3, 0, 2, "OE"
        ],
        [3, 3, 2, "PA"
        ],
        [4, 0, 2, "NS"
        ],
        [4, 3, 2, "AT"
        ]
    ],
    "Down": [
        [0, 0, 5, "BYRON"
        ],
        [0, 1, 5, "MOSES"
        ],
        [0, 3, 5, "UPUPA"
        ],
        [0, 4, 5, "MORAT"
        ]
    ]
}

const data2 = {
    "Rows": 5,
    "Columns": 5,
    "Grid": "LS1GT0UtLUVMRktFTkFGSE9ELS1BTVktLQ==",
    "Across": [
        [0, 2, 3, "FOE"
        ],
        [1, 2, 3, "ELF"
        ],
        [2, 0, 5, "KENAF"
        ],
        [3, 0, 3, "HOD"
        ],
        [4, 0, 3, "AMY"
        ]
    ],
    "Down": [
        [0, 2, 5, "FENDY"
        ],
        [0, 3, 3, "OLA"
        ],
        [0, 4, 3, "EFF"
        ],
        [2, 0, 3, "KHA"
        ],
        [2, 1, 3, "EOM"
        ]
    ]
}

const data3 = {
    "Rows": 5,
    "Columns": 5,
    "Grid": "LS1OQVRTVEFSWVBPS0lFRUNPTEVDSE8tLQ==",
    "Across": [
        [0, 2, 3, "NAT"
        ],
        [1, 0, 5, "STARY"
        ],
        [2, 0, 5, "POKIE"
        ],
        [3, 0, 5, "ECOLE"
        ],
        [4, 0, 3, "CHO"
        ]
    ],
    "Down": [
        [0, 2, 5, "NAKOO"
        ],
        [0, 3, 4, "ARIL"
        ],
        [0, 4, 4, "TYEE"
        ],
        [1, 0, 4, "SPEC"
        ],
        [1, 1, 4, "TOCH"
        ]
    ]
}

const data4 = { "Rows": 5, "Columns": 5, "Grid": "SUMtSE1TTy1VU0VSLUZUVUctRkVNSS1ZUg==", "Across": [[0, 0, 2, "IC"], [0, 3, 2, "HM"], [1, 0, 2, "SO"], [1, 3, 2, "US"], [2, 0, 2, "ER"], [2, 3, 2, "FT"], [3, 0, 2, "UG"], [3, 3, 2, "FE"], [4, 0, 2, "MI"], [4, 3, 2, "YR"]], "Down": [[0, 0, 5, "ISEUM"], [0, 1, 5, "CORGI"], [0, 3, 5, "HUFFY"], [0, 4, 5, "MSTER"]] }


const mockData = async () => {
    return new Promise<APIResponse>((resolve) => {
        setTimeout(() => {
            Math.random() > 0.8 ? resolve(data0 as APIResponse) : Math.random() > 0.6 ? resolve(data1 as APIResponse) : Math.random() > 0.4 ? resolve(data2 as APIResponse) : Math.random() > 0.2 ? resolve(data3 as APIResponse) : resolve(data4 as APIResponse)
        }, 1000)
    })
}

const fetchData = async () => {
    const response = await fetch(new URL('/new', import.meta.env.PUBLIC_CROSSWORD_API_URL))
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    return response.json() as Promise<APIResponse>
}

const Cell = (props: { row: number, column: number, across: number, down: number, n: number, onClick: (row: number, column: number) => void }) => {
    const [color, setColor] = createSignal("bg-white")

    const crossword = useCrossword()

    createEffect(() => {
        if (props.across === -1 && props.down === -1) {
            setColor("bg-black")
        } else if (crossword?.activeRow === props.row && crossword.activeCol === props.column) {
            setColor("bg-amber-300")
        } else if (crossword?.activeAcross && crossword?.activeClueIndex === props.across) {
            setColor("bg-sky-200")
        } else if (!crossword?.activeAcross && crossword?.activeClueIndex === props.down) {
            setColor("bg-sky-200")
        } else {
            setColor("bg-white")
        }
    })

    return (
        <div class={`h-20 w-20 uppercase relative text-center content-end select-none ${color()}`}
            onclick={() => props.onClick(props.row, props.column)}
        >
            <span class="absolute top-0 left-1 text-xl font-light">{props.n > -1 ? props.n : ''}</span>
            <span class="text-5xl">{crossword?.letters[props.row][props.column]}</span>
        </div>
    )
}

const App = () => {
    // const [data, { mutate, refetch }] = createResource(() => mockData())
    const [data, {mutate, refetch}] = createResource(() => fetchData())

    createEffect(() => { document.addEventListener("keydown", handleKeyDown) })

    const [crossword, setCrossword] = createStore<CrosswordContextType>({
        solution: "", clues: [], letters: [], grid: [], activeRow: 0, activeCol: 0, activeAcross: true, activeClueIndex: 0
    })

    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault()

        switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                handleArrowKey(e);
                break;

            case "Tab":
                const currHintIndex = crossword.activeClueIndex
                var nextHintIndex = crossword.clues.findIndex((h, index) => {
                    return (index > currHintIndex) && (crossword.activeAcross === h[3])
                })
                if (nextHintIndex === -1) {
                    nextHintIndex = crossword.clues.findIndex((h, index) => {
                        return crossword.activeAcross !== h[3]
                    })
                }
                if (nextHintIndex === -1) {
                    nextHintIndex = 0
                }
                setCrossword({
                    // ...crossword,
                    activeClueIndex: nextHintIndex,
                    activeRow: crossword.clues[nextHintIndex][0],
                    activeCol: crossword.clues[nextHintIndex][1],
                    activeAcross: crossword.clues[nextHintIndex][3]
                })
                break;
            case "Backspace":
                if (crossword.letters[crossword.activeRow][crossword.activeCol] === "") {
                    if (crossword.activeAcross && crossword.activeCol > crossword.clues[crossword.activeClueIndex][1]) {
                        modifyMutable(crossword, produce(crossword => {
                            crossword.letters[crossword.activeRow][crossword.activeCol - 1] = ""
                            crossword.activeCol = crossword.activeCol - 1
                        }))
                    } else if (!crossword.activeAcross && crossword.activeRow > crossword.clues[crossword.activeClueIndex][0]) {
                        modifyMutable(crossword, produce(crossword => {
                            crossword.letters[crossword.activeRow - 1][crossword.activeCol] = ""
                            crossword.activeRow = crossword.activeRow - 1
                        }))
                    }
                } else {
                    setCrossword("letters", produce(letters => {
                        letters[crossword.activeRow][crossword.activeCol] = ""
                    }))
                }
                break;
            default:
                handleLetterKey(e);
                break;
        }
    }

    const handleLetterKey = (e: KeyboardEvent) => {
        if (Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").includes(e.key.toUpperCase())) {
            setCrossword("letters", produce(letters => {
                letters[crossword.activeRow][crossword.activeCol] = e.key.toUpperCase()
            }))
            if (crossword.activeAcross && crossword.activeCol < crossword.clues[crossword.activeClueIndex][1] + crossword.clues[crossword.activeClueIndex][2] - 1) {
                setCrossword({
                    activeCol: crossword.activeCol + 1
                })
            } else if (!crossword.activeAcross && crossword.activeRow < crossword.clues[crossword.activeClueIndex][0] + crossword.clues[crossword.activeClueIndex][2] - 1) {
                setCrossword({
                    activeRow: crossword.activeRow + 1
                })
            }
        }
    }

    const handleArrowKey = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                if (!crossword.activeAcross && crossword.activeRow > crossword.clues[crossword.activeClueIndex][0]) {
                    setCrossword({
                        activeRow: crossword.activeRow - 1
                    })
                } else if (crossword.activeAcross && crossword.grid[crossword.activeRow][crossword.activeCol][1] !== -1) {
                    setCrossword({
                        activeAcross: false,
                        activeClueIndex: crossword.grid[crossword.activeRow][crossword.activeCol][1]
                    })
                }
                break;
            case "ArrowDown":
                if (!crossword.activeAcross && crossword.activeRow < crossword.clues[crossword.activeClueIndex][0] + crossword.clues[crossword.activeClueIndex][2] - 1) {
                    setCrossword({
                        activeRow: crossword.activeRow + 1
                    })
                } else if (crossword.activeAcross && crossword.grid[crossword.activeRow][crossword.activeCol][1] !== -1) {
                    setCrossword({
                        activeAcross: false,
                        activeClueIndex: crossword.grid[crossword.activeRow][crossword.activeCol][1]
                    })
                }
                break;
            case "ArrowLeft":
                if (crossword.activeAcross && crossword.activeCol > crossword.clues[crossword.activeClueIndex][1]) {
                    setCrossword({
                        activeCol: crossword.activeCol - 1
                    })
                } else if (!crossword.activeAcross && crossword.grid[crossword.activeRow][crossword.activeCol][0] !== -1) {
                    setCrossword({
                        activeAcross: true,
                        activeClueIndex: crossword.grid[crossword.activeRow][crossword.activeCol][0]
                    })
                }
                break;
            case "ArrowRight":
                if (crossword.activeAcross && crossword.activeCol < crossword.clues[crossword.activeClueIndex][1] + crossword.clues[crossword.activeClueIndex][2] - 1) {
                    setCrossword({
                        activeCol: crossword.activeCol + 1
                    })
                } else if (!crossword.activeAcross && crossword.grid[crossword.activeRow][crossword.activeCol][0] !== -1) {
                    setCrossword({
                        activeAcross: true,
                        activeClueIndex: crossword.grid[crossword.activeRow][crossword.activeCol][0]
                    })
                }
                break;
        }
    }

    createEffect(on(data, (data) => {
        const rows = data?.Rows
        const columns = data?.Columns

        var clues: ClueType[] = []
        data?.Across.forEach(([row, column, length, clue]) => {
            clues.push([row, column, length, true, clue])
        })
        data?.Down.forEach(([row, column, length, clue]) => {
            clues.push([row, column, length, false, clue])
        })

        clues.sort((a, b) => {
            if (a[0] === b[0]) {
                if (a[1] === b[1]) {
                    return ~a[2]
                }
                return a[1] - b[1]
            }
            return a[0] - b[0]
        })

        const g = Array.from(Array(rows).keys()).map(() => Array.from(Array(columns).keys()).map(() => [-1, -1, -1]))

        var n = 1
        clues.forEach(([row, column, length, isAcross], index) => {
            if (!isAcross) {
                for (let i = 0; i < length; i++) {
                    g[row + i][column][1] = index
                }
                if (g[row][column][2] === -1) {
                    g[row][column][2] = n
                    n++
                }
            } else {
                for (let i = 0; i < length; i++) {
                    g[row][column + i][0] = index
                }
                if (g[row][column][2] === -1) {
                    g[row][column][2] = n
                    n++
                }
            }
        })

        var nextIndex = clues.findIndex(([row, column, length, isAcross, clue], index) => {
            return (index >= 0) && (crossword.activeAcross === isAcross)
        })
        if (nextIndex === -1) {
            nextIndex = 0
        }
        var next = clues[nextIndex]

        if (clues.length > 0) {
            const solution = atob(data?.Grid || "")
            let x = Array.from(Array(rows).keys()).map(() => Array.from(Array(columns).keys()).map(() => ""))

            for (let r = 0; r < rows!; r++) {
                for (let c = 0; c < columns!; c++) {
                    if (solution[r * columns! + c] === "-") {
                        x[r][c] = "-"
                    }
                }
            }

            setCrossword({
                solution: atob(data?.Grid || ""),
                clues: clues,
                // letters: Array.from(Array(rows).keys()).map(() => Array.from(Array(columns).keys()).map(() => "")),
                letters: x,
                grid: [...g],
                activeClueIndex: nextIndex,
                activeRow: next[0],
                activeCol: next[1],
                activeAcross: next[3],
            })
            setModalClosed(false)
        }
    }));

    const handleCellClick = (row: number, column: number) => {
        if (crossword.grid[row][column][0] === -1 && crossword.grid[row][column][1] === -1) {
            return
        }

        if (crossword.activeRow === row && crossword.activeCol === column) {
            if (crossword.activeAcross && crossword.grid[row][column][1] !== -1) {
                setCrossword({
                    activeAcross: false,
                    activeClueIndex: crossword.grid[row][column][1]
                })
            } else if (!crossword.activeAcross && crossword.grid[row][column][0] !== -1) {
                setCrossword({
                    activeAcross: true,
                    activeClueIndex: crossword.grid[row][column][0]
                })
            }
        }

        if (crossword.activeRow !== row || crossword.activeCol !== column) {
            const nextAcross = crossword.activeAcross && crossword.grid[row][column][0] !== -1
            setCrossword({
                activeRow: row,
                activeCol: column,
                activeClueIndex: crossword.grid[row][column][nextAcross ? 0 : 1],
                activeAcross: nextAcross
            })
        }
    }

    const [modalClosed, setModalClosed] = createSignal(false)
    const finished = createMemo(() => crossword.letters.flat().join('') === crossword.solution)
    const showModal = createMemo(() => finished() && !modalClosed())



    return (
        <div class='flex flex-col min-h-screen items-center justify-center pt-4'>
            <CrosswordProvider value={crossword}>
                <Show when={data.loading}>
                    <div class='flex flex-col items-center'>
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <p class='text-3xl text-blue-500 mx-auto p-2'>
                            GENERATING...
                        </p>
                        <p class='text-3xl text-blue-500 mx-auto p-2'>
                            This may take a few seconds
                        </p>
                    </div>
                </Show>


                <Switch>
                    <Match when={data.error}>
                        <div class='flex'>
                            <p class='text-3xl text-red-500 mx-auto p-8'>
                                ERROR!
                            </p>
                        </div>
                    </Match>
                    <Match when={!data.loading && data()}>

                        <Show when={showModal()}>
                            <Portal>
                                <div class='fixed inset-0 bg-black bg-opacity-50 z-50'>
                                    <div class='bg-white w-1/2 mx-auto my-20 p-8 rounded-lg'>
                                        <div class='flex flex-col'>
                                            <p class='text-3xl text-green-600 mx-auto p-8'>
                                                FINISHED!
                                            </p>
                                            <button class='text-3xl text-blue-600 mx-auto p-8' onClick={() => setModalClosed(true)}>
                                                Return to crossword
                                            </button>
                                            <button class='text-3xl text-blue-600 mx-auto p-8' onClick={() => refetch()}>
                                                New crossword
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Portal>
                        </Show>

                        <div class='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>

                            <div class='lg:justify-self-end w-min m-auto lg:m-0'>
                                <div class="flex text-lg bg-sky-200 p-1">
                                    <Show when={crossword.clues.length > 0}>
                                        <span class="font-bold">
                                            {crossword.grid[crossword.clues[crossword.activeClueIndex][0]][crossword.clues[crossword.activeClueIndex][1]][2]}{crossword.activeAcross ? 'A': 'D'}</span>
                                        <span class="pl-2">{crossword.clues[crossword.activeClueIndex][4]} ({crossword.clues[crossword.activeClueIndex][2]})</span>
                                    </Show>
                                </div>


                                <div class={`mx-auto grid gap-0.5 bg-black mt-2 p-1 w-fit grid-cols-${crossword.grid.length} w-max`}>
                                    <For each={crossword.grid}>{(row, r) => (
                                        <For each={row}>{([across, down, n], c) => (
                                            <Cell row={r()} column={c()} across={across} down={down} n={n} onClick={handleCellClick} />
                                        )}
                                        </For>
                                    )}
                                    </For>
                                </div>

                                <Show when={finished()}>
                                    <div class='w-fit mx-auto pt-4'>
                                        <p class='text-3xl text-green-600'>
                                            FINISHED!
                                        </p>
                                    </div>
                                </Show>

                            </div>
                            <div class='p-4 lg:p-0'>
                                <div>
                                    <p class='text-lg text-gray-700'>Across</p>
                                    <For each={crossword.clues}>{([row, column, length, isAcross, clue], index) => (
                                        crossword.clues[index()][3] &&
                                        <div onClick={() => {
                                            setCrossword(produce(crossword => {
                                                crossword.activeClueIndex = index()
                                                crossword.activeRow = row
                                                crossword.activeCol = column
                                                crossword.activeAcross = isAcross
                                            }))
                                        }}
                                        class={`pl-2 py-1 border-l-4 leading-6 cursor-pointer ${crossword.activeClueIndex === index() ? "text-black border-sky-300 text-md" : "text-gray-500 border-transparent text-md"}`}>
                                            {crossword.grid[row][column][2]}: {clue} ({length})
                                        </div>
                                    )}
                                    </For>
                                </div>
                                <div class='pt-8'>
                                    <p class='text-lg text-gray-700'>Down</p>
                                    <For each={crossword.clues}>{([row, column, length, isAcross, clue], index) => (
                                        !crossword.clues[index()][3] &&
                                        <div onClick={() => {
                                            setCrossword(produce(crossword => {
                                                crossword.activeClueIndex = index()
                                                crossword.activeRow = row
                                                crossword.activeCol = column
                                                crossword.activeAcross = isAcross
                                            }))
                                        }}
                                        class={`pl-2 py-1 border-l-4 leading-6 cursor-pointer ${crossword.activeClueIndex === index() ? "text-black border-sky-300 text-lg" : "text-gray-500 border-transparent text-md"}`}>
                                            {crossword.grid[row][column][2]}: {clue} ({length})
                                        </div>
                                    )}
                                    </For>
                                </div>
                            </div>


                        </div>

                        <div class='flex gap-5 pt-8'>
                            <button type="button" onClick={() => refetch()}
                                class="py-3 px-4 inline-flex items-center gap-x-2 text-lg font-medium rounded-lg border border-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:bg-blue-100 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:bg-blue-800/30 dark:focus:text-blue-400">
                                Generate New Crossword
                            </button>
                        </div>
                    </Match>
                </Switch>
            </CrosswordProvider>
        </div>
    )
}

export default App