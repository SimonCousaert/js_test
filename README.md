# AA Gent Latest Articles Scraper

This project scrapes the latest "AA Gent" articles from [Sporza](https://sporza.be) using [Puppeteer](https://github.com/puppeteer/puppeteer).  
It then sends the titles and links to a specified Telegram chat via the [Telegram Bot API](https://core.telegram.org/bots/api) using [axios](https://axios-http.com/).

## Prerequisites

1. [Node.js](https://nodejs.org/) (v14 or later recommended)
2. npm (comes with Node.js) or Yarn
3. A Telegram Bot token from [@BotFather](https://telegram.me/BotFather)
4. A Telegram Chat ID (can be a private chat or group chat)

## Installation

1. **Clone the repository** (or download the ZIP):

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name