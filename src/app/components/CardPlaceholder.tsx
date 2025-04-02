import styles from "./Card.module.css";

export default function CardPlaceholder(props: {
    col: number,
    row: number,
    visible ?: boolean,
    tempStyles ?: React.CSSProperties
}) {
    const {col, row, tempStyles} = props;

    return (
        <div className={styles.placeholder}
            data-col={col}
            data-row={row}
            style={tempStyles}
        >
            &nbsp;
        </div>
    )
}