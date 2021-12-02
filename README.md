## Advent of Code

This is my personal playground for [advent of code](https://adventofcode.com/), implemented in typescript.

### Scaffolding

To pull in your input dynamically create a .env file with your advent of code session cookie value. You can find this by logging into advent of code and viewing your cookie/inspecting your request headers in the chrome developer console or similar tools. See the .env.example as what your .env file should look like.

Run `npm run generate` and follow the prompts to select the year and day you plan to scaffold, or run `npm run generate <year> <day>`.

The this command will both scaffold the boilerplate code required for the specified year & day as well as output the command to execute that year & day as well as copy it to your clipboard so you can paste it in a terminal and run quickly.

If you do not populate your session cookie your input.txt file that is scaffolded will have the text `error` in it, you can simply copy the input manually from the website into this file.

### Example execution

`npm run dev src\2021\01`

Will run the script for day 1 of 2021 in watch mode so that whenever a code change happens the script executes again.

e.g.

```typescript
➜  AdventOfCode git:(main) npm run dev src/2021/01

> node-proxy@1.0.0 dev
> nodemon "src/2021/01"

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node src/2021/01`
Time: 0.335ms
Solution to part 1: 1342
Solution to part 2: 1378
[nodemon] clean exit - waiting for changes before restart
```

and then on edit of a file

```typescript
[nodemon] restarting due to changes...
[nodemon] starting `ts-node src/2021/01`
Time: 0.338ms
Solution to part 1: 1342
Solution to part 2: 1378
[nodemon] clean exit - waiting for changes before restart
```
