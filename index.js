/**
 * index.js
 *
 * This script scrapes the latest "AA Gent" articles from Sporza using Puppeteer,
 * compares them with previously stored articles, and only sends a Telegram
 * message if there are new articles.
 */

require('dotenv').config();
const fs = require('fs');
const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  try {
    /****************************************
     * 1. Load Previously Stored Articles
     ****************************************/
    const STORED_ARTICLES_FILE = 'storedArticles.json';
    let storedArticles = [];

    // Check if storedArticles.json exists and load it
    if (fs.existsSync(STORED_ARTICLES_FILE)) {
      storedArticles = JSON.parse(fs.readFileSync(STORED_ARTICLES_FILE, 'utf8'));
    }

    /****************************************
     * 2. Puppeteer: Scrape Latest Articles
     ****************************************/
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the Sporza search page
    await page.goto('https://sporza.be/nl/zoek/?p=1');

    // Type "AA Gent" in the search field
    await page.type(
      'input[placeholder="zoek sporten, competities, artikels, sporters, …"]',
      'AA Gent'
    );
    await page.keyboard.press('Enter');

    // Wait for the search results container to appear
    await page.waitForSelector('._grid_1al6m_26');

    // Extract the first 3 article titles and links
    const articles = await page.$$eval('._itemWrapper_15742_303', (items) =>
      items.slice(0, 3).map((item) => ({
        title: item.querySelector('._title_dzcnu_53').innerText.trim(),
        link: item.querySelector('a').href,
      }))
    );

    // Close the browser
    await browser.close();

    /****************************************
     * 3. Check for New Articles
     ****************************************/
    // A helper function to see if an article is new
    // We'll check uniqueness by link or title
    function isArticleNew(article, storedList) {
      return !storedList.some(
        (storedItem) =>
          storedItem.title === article.title && storedItem.link === article.link
      );
    }

    // Filter the scraped articles to see which ones are new
    const newArticles = articles.filter((article) =>
      isArticleNew(article, storedArticles)
    );

    // Proceed only if there's at least one new article
    if (newArticles.length > 0) {
      /****************************************
       * 4. Format the Message for Telegram
       ****************************************/
      let messageText = 'Here are the latest AA Gent articles:\n\n';
      newArticles.forEach((article, index) => {
        messageText += `${index + 1}. ${article.title}\n   ${article.link}\n\n`;
      });

      /****************************************
       * 5. Send Message to Telegram via Bot
       ****************************************/
      const token = process.env.TELEGRAM_BOT_TOKEN;  // Bot token from .env
      const chatId = process.env.TELEGRAM_CHAT_ID;   // Chat or group ID from .env
      const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

      const response = await axios.post(telegramApiUrl, {
        chat_id: chatId,
        text: messageText,
      });

      // Check the response
      if (response.data.ok) {
        console.log('Telegram message sent successfully!');
      } else {
        console.error('Telegram API Error:', response.data);
      }
    } else {
      console.log('No new articles found. Telegram message not sent.');
    }

    /****************************************
     * 6. Update Stored Articles
     ****************************************/
    // Always update the file with the latest 3 articles
    fs.writeFileSync(STORED_ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8');
    console.log('Stored articles updated.');

  } catch (error) {
    console.error('Error:', error);
  }
})();