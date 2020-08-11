# Benchmarker
This script is an automated tool for capturing multiple screenshots based on dynamic search queries. It takes the queries, search them on Google (using Puppeteer.js), open the first result and take a screenshot of desktop and/or mobile versions. You can include multiple queries at once too.

The main objective is to assist designers doing benchmarks or researching lots of pages, since it speeds and automates the work of searching for each page and taking snapshots.

## Installing
1. Install [Node.js](https://nodejs.org/en/download/)
2. Open terminal and run
    ```bash
    npm i design-benchmarker -g
    ```
3. (Optional) You can also clone this repository or download as .ZIP. If you do so, in the codes below you will need to replace `benchmarker` to `node benchmarker.js`

## Usage
After installing the dependencies, call the script in your terminal:
```bash
benchmarker "checkin rules" --folder ~/Desktop/screenshots
```

### Simple query
Pass a text string to benchmarker or use a `--search` parameter
```bash
benchmarker "checkin rules" --folder ~/Desktop/screenshots
# same as
benchmarker --search "checkin rules" --folder ~/Desktop/screenshots
# same as
```

### Change screenshots directory
If you don't know where the screenshots are being saved to or want to change it, set it manually:
```bash
benchmarker "checkin rules" --folder ~/Desktop/customScreenshotFolder
```

### Dynamic queries
Use double brackets `[[listItem]]` to include dynamic variables from the lists created in [lists.js](https://github.com/kikobr/Benchmarker/blob/master/lists.js). This is located in the folder your benchmarker is installed (See "Create or edit lists" below).

For example, a list named "ciaBr" with the items "azul", "gol", "latam" and a search term like `regras de checkin [[ciaBr]]` will yield three variations of this query for each of the variables.
```bash
benchmarker "regras de checkin [[ciaBr]]" --folder ~/Desktop/screenshots
# regras de checkin azul
# regras de checkin gol
# regras de checkin latam
```

### Multiple queries
Use comma (`,`) to use input multiple sentences:
```bash
benchmarker "regras de checkin [[ciaBr]], checkin rules [[ciaEn]]" --folder ~/Desktop/screenshots
# regras de checkin azul
# regras de checkin gol
# regras de checkin latam
# checkin rules jetblue
# checkin rules american airlines
# ...
```

### Create or edit lists
Run the command below to show your benchmarker folder, then modify `lists.js` file
```bash
benchmarker --showLists
```

### Screenshot Mobile and Desktop
Use `--desktop` and `--mobile` parameter
```bash
benchmarker "regras de checkin [[ciaBr]]" --desktop --mobile --folder ~/Desktop/screenshots
```

### Hide browser
This will make Chromium browser run in background.
```bash
benchmarker "regras de checkin [[ciaBr]]" --headless --folder ~/Desktop/screenshots
```

### Help
Forgot something? All the commands are summarised with:
```bash
benchmarker --help
# or
benchmarker -h
```
