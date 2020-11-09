# Election Scraper

## About

I wrote this little script to keep tabs on the election as the count came in. The scraper pulls data from the NY Times and puts it into a PostgreSQL database.

The user supplies a list of state names and the script polls the NYTimes data every 60 seconds to see if any new data has been added.

There's no front-end except the SQL you write yourself.

## Usage

1. Clone this repository
1. Run `npm install` to install the required packages
1. Run `npm run db:setup` to setup your database. Make sure you're running PostgreSQL!

To run the scraper, pass `index.js` a list of states you want to scrape:

```console
node index.js georgia pennsylvania nevada
```

This will pull the data for Georgia, Pennsylvania, and Nevada once every 60 seconds.

### SQL Queries

The main query I use, which shows Biden's net lead across all states along with the percent increase over the last dump.

```sql
WITH net_live_results AS (
  SELECT
    last_updated,
    state,
    biden_votes - trump_votes AS net_biden,
    biden_votes,
    LAG(biden_votes, -1) OVER (PARTITION BY state ORDER BY last_updated DESC) AS biden_votes_p,
    LAG(trump_votes, -1) OVER (PARTITION BY state ORDER BY last_updated DESC) AS trump_votes_p,
    CAST(LAG(biden_votes - trump_votes, -1) OVER (PARTITION BY state ORDER BY last_updated DESC) AS DECIMAL(10,4)) AS net_biden_p
  FROM live_results
)

SELECT DISTINCT ON (state)
  last_updated,
  state,
  net_biden,
  ROUND((net_biden - net_biden_p)/ABS(net_biden_p) * 100, 3) AS biden_pct_inc
FROM net_live_results
ORDER BY state, last_updated DESC;
```
