"use client"
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./CardContainer.module.css";
import { CardInfo } from "../domain/card-info";
import Card from "./Card";

function defaultCardAssigner(columns: number, cards: CardInfo[]): CardInfo[][] {
    const rv: CardInfo[][] = Array(columns).fill(0).map(_ => []);
    const cardsPerColumn = (cards.length + cards.length % columns) / columns;
    for (let i = 0; i < cards.length; i++) {
        rv[Math.floor(i / cardsPerColumn)].push(cards[i]);
    }

    return rv;
}

export default function CardContainer(props: {
    columns: number,
    cards: CardInfo[]
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState<CardInfo[][]>(
        () => defaultCardAssigner(props.columns, props.cards)
    );

    const handleDragOver = useCallback((ev: React.DragEvent) => {
        ev.preventDefault();
    }, []);

    const columnElements = useMemo(() => {
        return columns.flatMap((cards, idx) => [
            <div key={`col-${idx}`} className={styles["column"]}>
                {cards.map(card => 
                    <Card key={card.id} title={card.title} />
                )}
            </div>,
            idx !== columns.length 
                ? <div key={`divider-${idx}`} className={styles["divider"]}></div>
                : undefined
        ]);
    }, [columns]);


    return (
        <div className={styles["card-container"]}
            ref={containerRef}
            onDragOver={handleDragOver}
        >
            {columnElements}
        </div>);
}