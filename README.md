# fin-ratios

Calculate annual financial analysis data from Google Finance, and generate CSV-formatted result.

```shell
  # Download & Install
  git clone https://github.com/nickdoth/fin-ratios
  cd fin-ratios
  npm install
  # Usage: node index [-r | -a] <query>
  # (Generate CSV output)
  node index nasdaq:aapl > ../nasdaq-aapl.csv
  # (Generate CSV of original finance data)
  node index --raw nasdaq:aapl > ../nasdaq-aapl-raw.csv
```
