import './Item.css'
export default function Item (props){
    return(
        <div className="item">
            <img src ={props.image} alt = ''/>
            <p>{props.name}</p>
            <div className="item-prices">
                <div className="item-price-new">
                KES {props.new_price}
                </div>
                <div className="item-price-old">
                KES {props.old_price}
                </div>
            </div>
        </div>
    )
}