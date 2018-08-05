import * as robot from './robot';

describe('toy robot game', () => {
    describe('render a robot with place command', () => {
        it('return robot position and facing degree', () => {
            expect(robot.placeCommand("PLACE 0,1,SOUTH")).toMatchObject({
                position: {
                    x: 0,
                    y: 1
                },
                direction: 180
            });
        });

        it('will move one step forward if MOVE command provided', () => {
            expect(robot.moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 0})).toMatchObject({
                position: {
                    x: 0,
                    y: 1
                },
                direction: 0
            });
            expect(robot.moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 90})).toMatchObject({
                position: {
                    x: 1,
                    y: 0
                },
                direction: 90
            });
            expect(robot.moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 180})).toMatchObject({
                position: {
                    x: 0,
                    y: 0
                },
                direction: 180
            });
            expect(robot.moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 270})).toMatchObject({
                position: {
                    x: 0,
                    y: 0
                },
                direction: 270
            });
            expect(robot.moveCommand({currentPosition: {x: 0, y: 0}, currentDirection: 0})).toMatchObject({
                position: {
                    x: 0,
                    y: 1
                },
                direction: 0
            });
            expect(robot.moveCommand({currentPosition: {x: 5, y: 0}, currentDirection: 90})).toMatchObject({
                position: {
                    x: 5,
                    y: 0
                },
                direction: 90
            });
            expect(robot.moveCommand({currentPosition: {x: 0, y: 5}, currentDirection: 180})).toMatchObject({
                position: {
                    x: 0,
                    y: 4
                },
                direction: 180
            });
            expect(robot.moveCommand({currentPosition: {x: 5, y: 0}, currentDirection: 270})).toMatchObject({
                position: {
                    x: 4,
                    y: 0
                },
                direction: 270
            });
        });

        it('will rotate 90 degree if RIGHT command provided', () => {
            expect(robot.rightCommand(90)).toBe(180);
        });

        it('will rotate -90 degree if LEFT command provided', () => {
            expect(robot.leftCommand(90)).toBe(0);
        });
    });

    describe('render robot', () => {
        it('will return robot position on the board', () => {
            const mockCommandList = 'PLACE 4,2,EAST>MOVE>MOVE>LEFT>MOVE>REPORT';
            expect(robot.robotListenToCommands(mockCommandList)).toBe('I am now at x:4, y:3 and facing:NORTH')
        });
    });
});
