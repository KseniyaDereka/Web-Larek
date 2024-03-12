import { ILotItem } from "../types";
import { View } from "./base/View";
import { ensureElement } from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface ICard extends ILotItem { button?: string}

const category: Record<string, string> =  {
    "софт-скил": "_soft",
    "другое": "_other",
    "дополнительное": "_additional",
    "кнопка": "_button",
    "хард-скил": "_hard"
}


class Card extends View<ICard> {
   
}