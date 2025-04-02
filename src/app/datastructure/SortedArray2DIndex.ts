export type BoundingBox = {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
};

export type Entry<T> = {
    box: BoundingBox;
    data: T;
};

/**
 * Speeds up point-in-rectangle queries.
 * Simple and effective for small datasets.
 * 
 * Time complexities:
 * - construction: O(nlogn)
 * - query: O(logn) up to O(n)
 * where n is the number of bounding boxes.
 */
export class SortedArray2DIndex<T> {
    private readonly boxes: Entry<T>[];

    /**
     * Initializes the index with an unsorted array of entries.
     * @param entries unsorted array of entries.
     */
    constructor(entries: readonly Entry<T>[]) {
        this.boxes = entries.toSorted((a, b) => a.box.yMin - b.box.yMin);
    }

    /**
     * 
     * @param px 
     * @param py 
     * @returns [mapped value, box matched] if a match is found. null otherwise.
     */
    findOne(px: number, py: number): [T, BoundingBox] | null {
        for (let i = this.binarySearchLast(py); i >= 0; i--) {
            const { box, data } = this.boxes[i];

            if (px >= box.xMin && px <= box.xMax && py <= box.yMax && py >= box.yMin) {
                return [data, box];
            }
        }
        return null;
    }

    // returns the idx of the last rect whose yMin <= py
    private binarySearchLast(py: number): number {
        let l = 0; 
        let r = this.boxes.length; // exclusive

        while (l < r) {
            const m = l + r >> 1;
            if (this.boxes[m].box.yMin > py) {
                r = m
            } else {
                l = m + 1;
            }
        }

        return l - 1;
    }
}
