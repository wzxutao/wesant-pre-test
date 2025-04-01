"use client";
import { useCallback, useState } from "react";
import styles from "./Card.module.css";

export interface CardProps {
    title: string,
    onDrag?: (clientXY: [number, number]) => void,
    onDragEnd?: (clientXY: [number, number]) => void,
}

export default function Card(props: CardProps) {
    const { title, onDrag, onDragEnd } = props;
    const [initialPointerXY, setInitialPointerXY] = useState<[number, number] | null>(null);
    const [currentPointerXY, setCurrentPointerXY] = useState<[number, number] | null>(null);


    const handlePointerDown = useCallback((ev: React.PointerEvent) => {
        ev.stopPropagation();
        ev.currentTarget.setPointerCapture(ev.pointerId);
        setInitialPointerXY([ev.clientX, ev.clientY]);
    }, []);

    const handlePointerUp = useCallback((ev: React.PointerEvent) => {
        ev.stopPropagation();
        ev.currentTarget.releasePointerCapture(ev.pointerId);
        onDragEnd?.([ev.clientX, ev.clientY]);
        setInitialPointerXY(null);
        setCurrentPointerXY(null);
    }, [onDragEnd]);

    const handlePointerMove = useCallback((ev: React.MouseEvent) => {
        ev.stopPropagation();
        const xy: [number, number] = [ev.clientX, ev.clientY]
        setCurrentPointerXY(xy);
        onDrag?.(xy);
    }, [onDrag]);

    const tempStyles: React.CSSProperties = {
        transform: initialPointerXY && currentPointerXY
            ? `translate(${currentPointerXY?.[0] - initialPointerXY[0]}px, ${currentPointerXY[1] - initialPointerXY[1]}px)`
            : 'none',
    }

    return (
        <div className={styles.card}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            style={tempStyles}
        >
            {title}
        </div>
    )
}