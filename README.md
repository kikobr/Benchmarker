# Benchmarker
This script is an automated tool for capturing multiple screenshots based on dynamic search terms.

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
node index --search "checkin rules"
```

### Dynamic queries
Use double brackets [[listItem]] to include dynamic variables from the lists created in "lists.js".

For example, a list named "ciaBr" with the items "azul", "gol", "latam" and a search term like "regras de checkin [[ciaBr]]" will yield three variations of this query for each of the variables.
```bash
node index --search "regras de checkin [[ciaBr]]"
# regras de checkin azul
# regras de checkin gol
# regras de checkin latam
```

### Multiple queries
Use comma (,) to use input multiple sentences:
```bash
node index --search "regras de checkin [[ciaBr]], checkin rules [[ciaEn]]"
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
node index --search "regras de checkin [[ciaBr]]" --desktop --mobile
```

### Hide browser
```bash
node index --search "regras de checkin [[ciaBr]]" --headless
```
