import Image from "next/image";
import CardContainer from "./components/CardContainer";
import { CardInfo } from "./domain/card-info";

const cards: CardInfo[] = [
  {
    id: 1,
    title: "Task A"
  },
  {
    id: 2,
    title: "Task B"
  },
  {
    id: 3,
    title: "Task C"
  },
  {
    id: 4,
    title: "Task D"
  },
  {
    id: 5,
    title: "Task E"
  },
]

export default function Home() {
  return (
    <CardContainer columns={2} cards={cards} />
  );
}
