"use client"
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./CardContainer.module.css";
import { CardInfo } from "../domain/card-info";
import Card from "./Card";
import { BoundingBox, Entry, SortedArray2DIndex } from "../datastructure/SortedArray2DIndex";
import CardPlaceholder from "./CardPlaceholder";

type CardInfoGrid = (CardInfo | null)[][]

// a range based assigner for distributing cards to columns
function defaultCardAssigner(columns: number, rows: number, cards: CardInfo[]): CardInfoGrid {
    const rv: CardInfoGrid = Array(columns).fill(0).map(_ => []);
    const cardsPerColumn = Math.ceil(cards.length / columns);
    for (let i = 0; i < cards.length; i++) {
        rv[Math.floor(i / cardsPerColumn)].push(cards[i]);
    }
    // fill empty slots
    for (const col of rv) {
        while (col.length < rows) {
            col.push(null)
        }
    }

    return rv;
}

export default function CardContainer(props: {
    columns: number,
    rows: number,
    cards: CardInfo[]
}) {
    const { columns: columnCount, rows: rowCount, cards } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    // use null for empty slots
    const [columns, setColumns] = useState<CardInfoGrid>(
        () => defaultCardAssigner(columnCount, rowCount, cards)
    );
    const [draggingCardIdxAndBox, setDraggingCardIdxAndBox] =
        useState<[[number, number], BoundingBox] | null>(null);
    const [droppingCardIdxAndBox, setDroppingCardIdxAndBox] =
        useState<[[number, number], BoundingBox] | null>(null);

    // returns indices into `columns`
    const [card2DIndex, setCard2DIndex] = useState<SortedArray2DIndex<[number, number]> | null>(null);

    const computeAndSetCard2DIndex = useCallback(() => {
        if (!containerRef.current) return null;

        const cardElements = containerRef.current.querySelectorAll('*[data-col][data-row]');
        const entries = Array.prototype.flatMap.call(cardElements, ((el: Element) => {
            const col = parseInt(el.getAttribute('data-col') ?? '');
            const row = parseInt(el.getAttribute('data-row') ?? '');
            if (!Number.isInteger(col) || !Number.isInteger(row)) {
                throw new Error(`col ${col} and row ${row} must be integers`);
            }
            const rect = el.getBoundingClientRect();
            return {
                box: {
                    xMin: rect.left,
                    xMax: rect.right,
                    yMin: rect.top,
                    yMax: rect.bottom
                },
                data: [col, row]
            } as Entry<[number, number]>
        })) as Entry<[number, number]>[]
        const rv = new SortedArray2DIndex(entries);
        setCard2DIndex(rv);
        return rv;
    }, [columns]);

    const handleDragStart = useCallback((x: number, y: number) => {
        const idx = computeAndSetCard2DIndex();
        const hit = idx?.findOne(x, y);
        if (!hit) {
            throw new Error("no hit on drag start");
        }
        setDraggingCardIdxAndBox(hit);
    }, [computeAndSetCard2DIndex]);

    const handleDrag = useCallback((x: number, y: number) => {
        if (!draggingCardIdxAndBox) return;
        const hit = card2DIndex?.findOne(x, y) ?? null;
        // if it's the same card being dragged
        if (hit
            && hit[0][0] === draggingCardIdxAndBox[0][0]
            && hit[0][1] === draggingCardIdxAndBox[0][1]) {
            setDroppingCardIdxAndBox(null);
            return;
        }
        // if it's the same card being dragged over
        if (hit && droppingCardIdxAndBox
            && hit[0][0] === droppingCardIdxAndBox[0][0]
            && hit[0][1] === droppingCardIdxAndBox[0][1]
        ) {
            return;
        }

        setDroppingCardIdxAndBox(hit);
    }, [card2DIndex, draggingCardIdxAndBox, droppingCardIdxAndBox]);

    const handleDragEnd = useCallback(() => {
        if (draggingCardIdxAndBox && droppingCardIdxAndBox) {
            const idx1 = draggingCardIdxAndBox[0];
            const idx2 = droppingCardIdxAndBox[0];
            const newColumns = [...columns];
            // swap the cards
            [
                newColumns[idx1[0]][idx1[1]],
                newColumns[idx2[0]][idx2[1]]
            ] = [
                    newColumns[idx2[0]][idx2[1]],
                    newColumns[idx1[0]][idx1[1]]
                ];
            setColumns(newColumns)
        }
        setDraggingCardIdxAndBox(null);
        setDroppingCardIdxAndBox(null);
    }, [draggingCardIdxAndBox, droppingCardIdxAndBox, columns])

    const draggedOverCardStyles = useMemo<React.CSSProperties>(() => {
        return {
            visibility: 'visible',
            backgroundColor: 'rgba(221, 221, 221, 0.7)'
        }
    }, [draggingCardIdxAndBox]);

    const columnElements = useMemo(() => {
        return columns.flatMap((cards, colIdx) => [
            <div key={`col-${colIdx}`} className={styles["column"]}>
                {cards.map((card, rowIdx) => {
                    const draggedOver = droppingCardIdxAndBox
                        && colIdx === droppingCardIdxAndBox[0][0]
                        && rowIdx === droppingCardIdxAndBox[0][1];

                    return card
                        ? <Card key={card.id}
                            col={colIdx}
                            row={rowIdx}
                            title={card.title}
                            onDragStart={handleDragStart}
                            onDrag={handleDrag}
                            onDragEnd={handleDragEnd}
                            tempStyles={draggedOver ? draggedOverCardStyles : undefined}
                        />
                        : <CardPlaceholder key={`empty-${colIdx}-${rowIdx}`}
                            col={colIdx} row={rowIdx}
                            tempStyles={draggedOver ? draggedOverCardStyles : undefined}
                        />
                })}
            </div>,
            colIdx !== columns.length
                ? <div key={`divider-${colIdx}`} className={styles["divider"]}></div>
                : undefined
        ]);
    }, [columns, handleDragStart, handleDrag, droppingCardIdxAndBox]);


    return (
        <div className={styles["card-container"]}
            ref={containerRef}
        >
            {columnElements}
        </div>);
}