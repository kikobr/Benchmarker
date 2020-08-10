# Benchmarker
This script is an automated tool for capturing multiple screenshots based on dynamic search queries. It takes the queries, search them on Google (using Puppeteer.js), open the first result and take a screenshot of desktop and/or mobile versions. You can include multiple queries at once too.

The main objective is to assist designers doing benchmarks or researching lots of pages, since it speeds and automates the work of searching for each page and taking snapshots.

## Installing
1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone this repository to your computer (download as ZIP ou type in the terminal):
```bash
git clone git@github.com:kikobr/Benchmarker.git
```
After cloning, go to the folder and install our dependencies:
```bash
cd ~/Documents/Benchmarker
npm install
```

## Usage
After installing the dependencies, call the script in your terminal:
```bash
node benchmarker.js "checkin rules"
```

### Simple query
Pass a text string to benchmarker.js or use a --search parameter
```bash
node benchmarker.js "checkin rules"
# same as
node benchmarker.js --search "checkin rules"
```

### Dynamic queries
Use double brackets [[listItem]] to include dynamic variables from the lists created in "lists.js".

For example, a list named "ciaBr" with the items "azul", "gol", "latam" and a search term like "regras de checkin [[ciaBr]]" will yield three variations of this query for each of the variables.
```bash
node benchmarker.js "regras de checkin [[ciaBr]]"
# regras de checkin azul
# regras de checkin gol
# regras de checkin latam
```

### Multiple queries
Use comma (,) to use input multiple sentences:
```bash
node benchmarker.js "regras de checkin [[ciaBr]], checkin rules [[ciaEn]]"
# regras de checkin azul
# regras de checkin gol
# regras de checkin latam
# checkin rules jetblue
# checkin rules american airlines
# ...
```

### Screenshot Mobile and Desktop
Use --desktop and --mobile parameter
```bash
node benchmarker.js "regras de checkin [[ciaBr]]" --desktop --mobile
```

### Hide browser
```bash
node benchmarker.js "regras de checkin [[ciaBr]]" --headless
```
