Simple scraper of en.softonic.com website top downloaded apps list.

## Scrape-tonic

This app scrapes info about top apps in a following five categories:
* Browsers
* Security & Privacy
* Internet & Network
* Social & Communication
* Utilities & Tools

To scrape data form those categories simply run this command in the project directory:

### `npm start`

To add another categories, e.g. Games, the specific constant should be added as following:

```
const writeStreamUGames = fs.createWriteStream("output/games.csv");
```

As well as this line inside an anonymous self-invoked function at the very end of the `scrape.js` file:

```
await scrapeIt("https://en.softonic.com/windows/games:weekly-downloads/", i, writeStreamGames); 
console.log("\tGames Done!");
```

All scraped results will be stored inside `outout/` dir as `*.csv` files.