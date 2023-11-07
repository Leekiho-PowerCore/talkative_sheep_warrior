const axios = require("axios");
require("dotenv").config();
const connection2 = require("../configs/db-connection.js").connection2;
const authController = require('../controllers/auth');


const apiKey = process.env.OPENAI_API_KEY;

const max_tokens = 1024;

async function generateTweets(mymbti, member, word) {
  try {
    // Query database for related articles
    const result = await new Promise((resolve, reject) => {
      connection2.query(
        `SELECT * FROM article WHERE mymbti = ? AND member = ? AND word = ?`,
        [mymbti, member, word],
        function (error, results) {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });
    console.log("mymbti : ", mymbti);
    console.log("member : ", member);
    console.log("word : ", word);
    console.log(
      "SQL Query:",
      `
    SELECT * FROM article
    WHERE mymbti = '${mymbti}' AND member = '${member}' AND word = '${word}'
`
    );

    if (!result || !Array.isArray(result) || result.length === 0) {
      console.error("No matching articles found in the database.");
    }

    const [rows, fields] = result;

    // Use the articles as references in your prompts
    const articleReferences = result
      .map((row, index) => `참고문헌${index + 1}: ${row.article_title}`)
      .join(", ");

    const prompts = [
      `${mymbti}와 ${member}가 함께 ${word}을/를 할 때 장점을 존댓말로 3가지씩 쉽게 알려줘. ${
        articleReferences ? articleReferences : ""
      }`,
      `${mymbti}와 ${member}가 함께 ${word}을/를 할 때 단점을 존댓말로 3가지씩 쉽게 알려줘. ${
        articleReferences ? articleReferences : ""
      }`,
      `${mymbti}와 ${member}가 함께 ${word}을/를 할 때 조심해야 할 점을 존댓말로 3가지씩 쉽게 알려줘. ${
        articleReferences ? articleReferences : ""
      }`,
    ];

    const tweets = [];

    for (const prompt of prompts) {
      const data = {
        prompt,
        max_tokens: max_tokens,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Extract generated tweets from API response
      const tweet = response.data.choices[0].text.trim();
      tweets.push(tweet);
    }

    console.log(tweets);
    return tweets;
  } catch (error) {
    console.error("Error occurred during tweet generation:", error);
    return null;
  }
}



async function insertArticle(tweets, mymbti, member, word, userId) {
  try {
    // Check that tweets is not null and has at least 3 elements
    if (!tweets || tweets.length < 3) {
      console.error("Invalid tweets array");
      return;
    }

    const generateQuery =
      "SELECT MAX(generate_id) AS generate_id FROM login.article";
    let generateId;

    const generateResults = await new Promise((resolve, reject) => {
      connection2.query(generateQuery, function (error, results) {
        if (error) reject(error);
        else resolve(results);
      });
    });

    generateId = generateResults[0].generate_id;
    generateId++;

    const pros = tweets[0];
    const cons = tweets[1];
    const careful = tweets[2];

    await connection2.query(
      "INSERT INTO login.article (mymbti, member, word, pros, cons, careful, generate_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [mymbti, member, word, pros, cons, careful, generateId, userId]
    );
  } catch (error) {
    console.error("Database insertion error:", error.message);
  }
}

module.exports = { generateTweets, insertArticle };
