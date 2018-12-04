import CardListItem from "./CardListItem";
import React from "react";

const CardList = (props) => {
    const cardItems = props.notes.map(note => (
        <CardListItem  key={note._id} note={note} history={props.history} />
    ));
    return (
        <div class="flex-container">
            {cardItems}
        </div>
    );
};

export default CardList;