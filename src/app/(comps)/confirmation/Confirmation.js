import React from 'react'
import './Confirmation.scss'

const Confirmation = (props) => {
  return (
    <div className='confirmation parent'>
      <div className='confirmation-container container'>


        <div className="box">
            <div className="top">
                <h3>{props.title}</h3>
            </div>
            {props.children}
            <div className="bottom">
                <button className="btn" onClick={props.clickA}>
                    {props.btnYes}
                </button>
                <button className="btn2" onClick={props.clickB} >
                    {props.btnNo}
                </button>
            </div>
        </div>


      
      </div>
    </div>
  )
}

export default Confirmation
