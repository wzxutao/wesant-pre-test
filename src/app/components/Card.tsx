"use client";
import { useCallback, useState } from "react";
import styles from "./Card.module.css";

export interface CardProps {
    title: string,
    col: number,
    row: number,
    onDragStart?: (x: number, y: number) => void,
    onDrag?: (x: number, y: number) => void,
    onDragEnd?: (x: number, y: number) => void,
    tempStyles ?: React.CSSProperties
}

export default function Card(props: CardProps) {
    const { title, col, row, onDragStart, onDrag, onDragEnd } = props;
    const [initialPointerXY, setInitialPointerXY] = useState<[number, number] | null>(null);
    const [currentPointerXY, setCurrentPointerXY] = useState<[number, number] | null>(null);


    const handlePointerDown = useCallback((ev: React.PointerEvent) => {
        ev.stopPropagation();
        const xy: [number, number] = [ev.clientX, ev.clientY]
        onDragStart?.(xy[0], xy[1]);
        ev.currentTarget.setPointerCapture(ev.pointerId);
        setInitialPointerXY(xy);
    }, [onDragStart]);

    const handlePointerUp = useCallback((ev: React.PointerEvent) => {
        ev.stopPropagation();
        ev.currentTarget.releasePointerCapture(ev.pointerId);
        setInitialPointerXY(null);
        setCurrentPointerXY(null);
        onDragEnd?.(ev.clientX, ev.clientY);
    }, [onDragEnd]);

    const handlePointerMove = useCallback((ev: React.PointerEvent) => {
        if(!initialPointerXY) return;
        ev.stopPropagation();
        const xy: [number, number] = [ev.clientX, ev.clientY]
        setCurrentPointerXY(xy);
        onDrag?.(xy[0], xy[1]);
    }, [onDrag, initialPointerXY]);

    const tempStyles: React.CSSProperties = {
        ...(props.tempStyles ?? {}),
        transform: initialPointerXY && currentPointerXY
            ? `translate(${Math.trunc(currentPointerXY[0] - initialPointerXY[0])}px,` +  
                        `${Math.trunc(currentPointerXY[1] - initialPointerXY[1])}px)`
            : 'none',
    }

    return (
        <div className={styles.card}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            style={tempStyles}
            data-col={col}
            data-row={row}
        >
            {title}
        </div>
    )
}