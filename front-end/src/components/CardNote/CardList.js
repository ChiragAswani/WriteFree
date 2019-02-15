import CardListItem from "./CardListItem";
import React from "react";
import '../../css/cardnote.css';

const CardList = (props) => {
    try{
        const cardItems = props.notes.map(note => (
            <CardListItem  key={note._id} note={note} history={props.history}/>
        ));
        return (
            <div className="cards">
                {cardItems}
            </div>
        );
    } catch (e){
        return <div></div>
    }

};

export default CardList;