const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('node:fs')
const xlsx = require('xlsx')


const pageUrl =
    "https://www.amazon.in/s?k=mobile+phones&crid=3P3KGSJE5GDO6&sprefix=mobile+phones%2Caps%2C377&ref=nb_sb_noss_1";


const headers = {
    "content-type": "text/html",
};

const getData = async (url) => {

    try {
        const response = await axios.get(url, {
            headers,
        });
        const data = response.data;
        console.log(data);
        fs.writeFileSync('webpageData.txt', data)

    } catch (error) {
        console.log('Error_Ocurred', error);
        return null;
    }
}
// getData(pageUrl)

const readDataFromFile = () => {
    const fileData = fs.readFileSync('webpageData.txt', { encoding: 'utf-8' })
    // console.log(fileData);
    // // console.log('end');
    return fileData;
}
const pageHtmlString = readDataFromFile();

const $ = cheerio.load(pageHtmlString);
const products = [];

$("div[data-asin]").each((index, element) => {
    const name = $(element).find("span.a-size-medium.a-color-base.a-text-normal").text();
    const price = $(element).find("span.a-price-whole").text();
    // console.log(price);
    const rating = $(element).find()
    products.push({ name, price, rating });
});
console.log(products);
const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(products);

xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
xlsx.writeFile(workbook, "products.xlsx");