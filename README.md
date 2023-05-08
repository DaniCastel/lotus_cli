# Lotus CLI

Lotus CLI is under development and has not yet released its first version, however, in the following drive you can obtain the tool

## Installation instructions

### Prerequisites

- Node 20.1.0 or greater

- Typescript 5.0.4 or greater

Create a .env file with the MOODLE_API environment variable

```
MOODLE_API="moodle api
```

In the root directory, install the node dependencies

`npm install` or `yarn`

Create _dist_ directory with
`npm run build` or `yarn build`

You can run the program directly with

```
node dist/index.js <command|option>
```

or you can install the tool locally

```
npm install -g .
```

then

```
lotus <command>
```

Enjoy

## Commands

### `community` Get plugins from Moodle Directory

The community command uses the Moodle api to get the list of plugins in the community, this CSV contains the following data for each plugin

- Name

- Component ID

- Latest version

- Moodle versions supported by latest version

- Repository URL

- Documentation URL

#### Use

Run the following line

```
lotus community
```

The program will request the plugins from the Moodle api and generate a CSV inside the dist folder.

You can upload import the csv in a google sheet file
