import * as robot from './robot';
import ReadLine from 'readline';

function requestUserInput() {
    const rl = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`Please enter command to direct the robot: 
    ****************************************************************
    EXAMPLE command(replace X, Y with number and F with direction): 
    PLACE X,Y,F>LEFT>MOVE>RIGHT>REPORT
    ****************************************************************
    `, (answer) => {
        console.log(robot.robotListenToCommands(answer));

        rl.close();
    });
}

requestUserInput();