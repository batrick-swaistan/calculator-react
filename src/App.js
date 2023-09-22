import { useReducer } from 'react';
import DigitButton from './Digitbutton';
import OperationButton from './OperationButton';
import './style.css';

export const ACTIONS={
  ADD_DIGIT:'add-digit',
  CHOOSE_OPERATION:'choose-operation',
  CLEAR:'clear',
  DELETE_DIGIT:'delete-digit',
  EVALUATE:'evaluate'
}

function reducer(state,{type ,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false,
        }
      }

      if(payload.digit && state.currentOperand === "0"){
        return{
          ...state,
          previousOperand:state.currentOperand,
          previousOperand:null,
          currentOperand:payload.digit
        }
      }

      if (payload.digit === "." && state.currentOperand==null) {return state}

      if(payload.digit==="." && state.currentOperand.includes(".")) {return state}
      

      if (payload.digit==="0" && state.currentOperand==="0"){
        return state
      } 
      if (payload.digit==="." && state.currentOperand.includes(".")) {
        return state
      }
      
      return{
        ...state,
        currentOperand:`${state.currentOperand || ""}${payload.digit}`
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null ){
        return state
      }

      if(state.previousOperand == null){
        return{
          ...state,
          operation:payload.operation,
          previousOperand:state.currentOperand,
          currentOperand:null,
        }
      }

      if(state.currentOperand==null){
        return{
          ...state,
          operation:payload.operation,
        }
      }


      return {

        ...state,
        previousOperand:evaluate(state),
        operation: payload.operation,
        currentOperand: null,

      }

    case ACTIONS.EVALUATE:
      if(state.operation ==null || state.previousOperand ==null || state.currentOperand == null){
        return state
      }

      return{
        ...state,
        previousOperand:null,
        operation:null,
        overwrite:true,
        currentOperand: evaluate(state),

      }



    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand:"0",
        operation:null,
        previousOperand:null
      }

    case ACTIONS.DELETE_DIGIT:

    if(state.overwrite){
      return{
        ...state,
        overwrite:false,
        currentOperand:null
        
      }
    }

    if (state.currentOperand === null || state.currentOperand === undefined) {
      
      return state; 
    }

    

    if(state.currentOperand.length === 1){
      return{
        ...state,
        currentOperand:null
      }
    }
    
    return{
      ...state,
      currentOperand: state.currentOperand.slice(0,state.currentOperand.length-1)
    }
  }
}


function evaluate({currentOperand,previousOperand,operation}){

  const prev=parseFloat(previousOperand)
  const current=parseFloat(currentOperand)

  if (isNaN(prev) || isNaN(current)) return ""

  let computation=""

  switch(operation){
    case "+":
      computation= prev + current
      break
    case "-":
      computation= prev - current
      break
    case "÷":
      computation=prev / current
      break
    case "*":
      computation=prev * current
      break
  }

  return computation.toString()

}

const INTEGER_FORMATTER= new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})


function formatoperator(operand){
  if (operand==null) return

  const [integer,decimal]=operand.split('.')

  if (decimal == null) return INTEGER_FORMATTER.format(integer);

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {

  const [{ currentOperand,previousOperand,operation },dispatch]=useReducer(
    reducer,
    {}
    )


  return (

    <>
    <div className='header'>
      <h1>Calculator</h1>
    </div>
    <div className="calculator-grid">
      <div className="output"> 

        <div className="previous-operand">{formatoperator(previousOperand)} {operation}</div>
        <div className="current-operand">{ formatoperator(currentOperand)} </div>

      </div>
      <button className="span-two" onClick={() => dispatch ({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch ({type:ACTIONS.DELETE_DIGIT})}> DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch ({type:ACTIONS.EVALUATE})}>=</button>
    </div>
    <div className='footer' id='footer'>
      <p>Developed by <a href='https://www.github.com/batrick-swaistan' target="_blank">Batrick Swaistan</a></p>
    </div>
  </>

    );
}

export default App;
