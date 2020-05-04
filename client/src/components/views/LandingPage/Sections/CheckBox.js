import React ,{ useState }from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) { 

    const [Checked, setChecked] = useState([])
    
    const handleToggle =(value)=>{
        //누른 것의 Index를 구하고
        const currentIndex = Checked.indexOf(value)
        //spread Operator를 이용해 전체 Checked data를 가져옴
        const newChecked = [...Checked]  
        //currentIndex 가 -1이면 값이 없는 것
        if(currentIndex === -1){
            //state를 넣어준다
            newChecked.push(value)        
        //만약 값이 있다면
        } else{
            // splice를 통해 값이 newChecked에서 지워진다
            newChecked.splice(currentIndex, 1)
        }
        //새롭게 나오는 checked를 넣어준다.
        setChecked(newChecked)
        //부모 components에 전달
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index)=>(
        <React.Fragment key={index} >
            <Checkbox onChange={()=> handleToggle(value._id)} checked={Checked.indexOf(value._id) === -1 ? false : true}/>
            <span>{value.name}</span>
        </React.Fragment>
    ))
 

    return (
        <div>
           <Collapse defaultActiveKey={['0']} >
                <Panel header="Continents" key="1">
                {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}
 
export default CheckBox
