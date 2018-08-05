const mockCommandList = 'PLACE 1,2,EAST>MOVE>MOVE>LEFT>MOVE>REPORT';

const initialPosition = {
    x: 0,
    y: 0,
    f: 'SOUTH'
};

const directionMapping = [
    {key: 'north', value: 0, label: 'NORTH'},
    {key: 'south', value: 180, label: 'SOUTH'},
    {key: 'east', value: 90, label: 'EAST'},
    {key: 'west', value: 270, label: 'WEST'}
];

const getMappedDirection = (directionInput) => {
    const directionObj = directionMapping.find((direction) => {
        return direction.label === directionInput.toUpperCase();
    });

    return directionObj.value;
}

export const placeCommand = (input) => {
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

export const moveCommand = ({currentPosition, currentDirection, maxSize = 5, minSize = 0}) => {
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

export const leftCommand = (currentFace) => {
    if (currentFace - 90 >= 0) {
        return currentFace -= 90;
    }
    return 270;
};

export const rightCommand = (currentFace) => {
    if (currentFace + 90 <= 360) {
        return currentFace += 90;
    }
    return 90;
};

export const reportCommand = (robot) => {
    const directionFormatted = (directionMapping.find(direction => direction.value === robot.direction) || []).label;
    const formattedRobot = Object.assign({}, robot, {direction: directionFormatted});

    return `I am now at x:${formattedRobot.position.x}, y:${formattedRobot.position.y} and facing:${formattedRobot.direction}`;
};

class Robot {
    constructor({position, direction} = {}) {
        this.position = position;
        this.direction = direction;
    }
}

export function robotListenToCommands(rawCommandList = mockCommandList) {
    const placeReg = RegExp('place', 'i');
    const commandList = rawCommandList.split('>');
    //loop for command
    // set position start in array
    let robot = new Robot;
    let result;

    commandList.forEach((command) => {
        const capCommand = command.toUpperCase();
        if (placeReg.test(capCommand)) {
            robot = Object.assign({}, robot, placeCommand(command));
        }
        if (capCommand === 'MOVE') {
            robot = Object.assign({}, robot, moveCommand({currentPosition: robot.position, currentDirection: robot.direction}));
        }

        if (capCommand === 'LEFT') {
            robot = Object.assign({}, robot, {direction: leftCommand(robot.direction)});
        }

        if (capCommand === 'RIGHT') {
            robot = Object.assign({}, robot, {direction: rightCommand(robot.direction)});
        }
        if (capCommand === 'REPORT') {
            result = reportCommand(robot);
        }
    });

    return result;
}
