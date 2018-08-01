import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
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

const boardSize = [
    '*****',
    '*****',
    '*****',
    '*****',
    '*****'
];

const mockCommandList = 'PLACE 1,2,EAST>MOVE>MOVE>LEFT>MOVE';

const getMappedDirection = (directionInput) => {
    const directionObj = directionMapping.find((direction) => {
        return direction.label === directionInput;
    });

    return directionObj.value;
}

const placeCommand = (input) => {
    if (input) {
        const arrayInXYF = input.split(' ')[1].split(',');
        return {
            position: {
                x: parseInt(arrayInXYF[0]),
                y: parseInt(arrayInXYF[1])
            },
            direction: getMappedDirection(arrayInXYF[2])
        };
    }

    return initialPosition;
};

const moveCommand = ({currentPosition, currentDirection, maxSize = 5, minSize = 0}) => {
    if(currentDirection === 90) {
        if(currentPosition.x + 1 < maxSize) {
            currentPosition.x += 1;
        }
    }

    if(currentDirection === 180) {
        if(currentPosition.y - 1 > minSize) {
            currentPosition.y -= 1;
        }
    }

    if(currentDirection === 270) {
        if(currentPosition.x - 1 > minSize) {
            currentPosition.x -= 1;
        }
    }

    if(currentDirection === 0 || currentDirection === 360) {
        if(currentPosition.y + 1 < maxSize) {
            currentPosition.y += 1;
        }
    }
    return {direction: currentDirection, position: currentPosition};
};

const leftCommand = (currentFace) => {
    console.log('currentFace;',currentFace);
    if (currentFace - 90 >= 0) {
        console.log('currentFace2;',currentFace);
        return currentFace -= 90;
    }
    return 270;
};

const rightCommand = (currentFace) => {
    if (currentFace + 90 <= 360) {
        return currentFace += 90;
    }
    return 90;
};

const reportCommand = (robot) => {
  console.log('Current robot position:', robot);
};

class Robot {
    constructor({position, direction} = {}) {
        this.position = position;
        this.direction = direction;
    }
}

function robotApp(rawCommandList = mockCommandList) {
    const placeReg = RegExp('place', 'i');
    const commandList = rawCommandList.split('>');
    //loop for command
    // set position start in array
    let robot = new Robot;
    let reportTriggered = false;

    commandList.forEach((command) => {
        if (placeReg.test(command)) {
            robot = Object.assign({}, robot, placeCommand(command));
        }
        if (command === 'MOVE') {
            robot = Object.assign({}, robot, moveCommand({currentPosition: robot.position, currentDirection: robot.direction}));
        }

        if (command === 'LEFT') {
            robot = {...robot, direction: leftCommand(robot.direction)};
        }

        if (command === 'RIGHT') {
            robot = {...robot, direction: rightCommand(robot.direction)};
        }
        if (command === 'REPORT') {
            reportCommand(robot);
            reportTriggered = true;
        }
    });
    if(reportTriggered) {
        return robot;
    }
}

describe('toy robot game', () => {
    describe('render a robot with place command', () => {
        const mockRobot = {
            position: {
                x: 0,
                y: 1
            },
            direction: 180
        };

        test('return robot position and facing degree', () => {
            expect(placeCommand("PLACE 0,1,SOUTH")).toMatchObject({
                position: {
                    x: 0,
                    y: 1
                },
                direction: 180
            });
        });

        it('will move one step forward if MOVE command provided', () => {
            expect(moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 0})).toMatchObject({
                position: {
                    x: 0,
                    y: 1
                },
                direction: 0
            });
            expect(moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 90})).toMatchObject({
                position: {
                    x: 1,
                    y: 0
                },
                direction: 90
            });
            expect(moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 180})).toMatchObject({
                position: {
                    x: 0,
                    y: 0
                },
                direction: 180
            });
            expect(moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 270})).toMatchObject({
                position: {
                    x: 0,
                    y: 0
                },
                direction: 270
            });
            expect(moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 0})).toMatchObject({
                position: {
                    x: 0,
                    y: 1
                },
                direction: 0
            });
            expect(moveCommand({currentPosition: {x: 5, y: 0}, currentDirection: 90})).toMatchObject({
                position: {
                    x: 5,
                    y: 0
                },
                direction: 90
            });
            expect(moveCommand({currentPosition: {x: 0, y: 5}, currentDirection: 180})).toMatchObject({
                position: {
                    x: 0,
                    y: 4
                },
                direction: 180
            });
            expect(moveCommand({currentPosition: {x: 5, y: 0}, currentDirection: 270})).toMatchObject({
                position: {
                    x: 4,
                    y: 0
                },
                direction: 270
            });
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

        it('command robot on the board', () => {
            const mockCommandList = 'PLACE 4,2,EAST>MOVE>MOVE>LEFT>MOVE>REPORT';
            expect(robotApp(mockCommandList)).toMatchObject({
                position: {
                    x: 4,
                    y: 3
                },
                direction: 0
            });
        });
    });
});
