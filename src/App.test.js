import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

const commandList = [
  'PLACE X,Y,F',
  'MOVE',
  'LEFT',
  'RIGHT',
  'REPORT'
];

const initialPosition = {
  x: 0,
  y: 0,
  f: 'SOUTH WEST'
};

const directionMapping = [
  {key: 'north', value: 0, label: 'NORTH'},
  {key: 'south', value: 180, label: 'SOUTH'},
  {key: 'east', value: 90, label: 'EAST'},
  {key: 'west', value: 270, label: 'WEST'},
  {key: 'southWest', value: 225, label: 'SOUTH WEST'},
  {key: 'southEast', value: 135, label: 'SOUTH EAST'},
  {key: 'northWest', value: 315, label: 'NORTH WEST'},
  {key: 'northEast', value: 45, label: 'NORTH EAST'}  
];

const getMappedDirection = (directionInput) => {
  const directionObj = directionMapping.find((direction)=> {
    return direction.label === directionInput;
  });

  return directionObj.value;
}

const placeCommand = (input) => {
  if(input) {
    const arrayInXYF = input.split(' ')[1].split(',');
    return {
     position:{ 
        x: parseInt(arrayInXYF[0]),
        y: parseInt(arrayInXYF[1])
      },
      direction: getMappedDirection(arrayInXYF[2])
    };
  }

  return initialPosition;
};

const moveCommand = (currentPosition) => {
  return currentPosition += 1;
};

const leftCommand = (currentFace) => {
  if(currentFace - 90 >= 0) {
    return currentFace -= 90;
  } 
  return 270;
};

const rightCommand = (currentFace) => {
  if(currentFace + 90 <= 360) {
    return currentFace += 90;
  } 
  return 90;
};

const boardSize = [
  '*****',
  '*****',
  '*****',
  '*****',
  '*****'
];

const mockCommandList = 'PLACE 0,0,SOUTH>MOVE>MOVE>RIGHT>MOVE';

class Robot {
  constructor({position, direction}={}) {
    this.position = position;
    this.direction = direction;
  }
}

function robotApp(commandList = mockCommandList) {
  const placeReg = RegExp('place','i');
  const command = commandList.split('>')[0];
  //loop for command
  // set position start in array
  let robot = new Robot;
// console.log('Hello', placeReg.test(command));
  if (placeReg.test(command)) {
    robot = Object.assign({}, robot, placeCommand(command));
  } 
    if(command === 'MOVE') {
      moveCommand(currentPosition);
    }

    if(command === 'LEFT') {
      leftCommand(currentFace);
    }
   
    if(command === 'RIGHT') {
      rightCommand(currentFace);
    }
    if(command === 'REPORT') {
      reportCommand();
    }

  return robot;
}

describe('toy robot game', () => {
  describe('render a robot with place command', () => {
    test('return robot position and facing degree', () => {
      expect(placeCommand("PLACE 0,1,SOUTH")).toMatchObject({
        position:{
          x: 0,
          y: 1
        },
        direction: 180
      });
    });

    it('will move one step forward if MOVE command provided', () => {
      expect(moveCommand(1)).toBe(2);
    });

    it('will rotate 90 degree if RIGHT command provided', () => {
      expect(rightCommand(90)).toBe(180);
    });

    it('will rotate -90 degree if LEFT command provided', () => {
      expect(leftCommand(90)).toBe(0);
    });
  });
  
  describe('render board', () => {
    it('a 5 unit board provided', () => {
      expect(boardSize.length).toBe(5);
    });

    it('place robot in board', () => {
      expect(robotApp()).toMatchObject({
        position:{
          x: 0,
          y: 0
        },
        direction: 180
      });
    });
  });
  
  describe('render input toggle', () => {

  });
});
