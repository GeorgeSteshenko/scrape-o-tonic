const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const writeStreamBrowsers = fs.createWriteStream("output/browsers.csv");
const writeStreamSecurityPrivacy = fs.createWriteStream("output/security_privacy.csv");
const writeStreamInternetNetwork = fs.createWriteStream("output/internet_network.csv");
const writeStreamSocialCommunication = fs.createWriteStream("output/social_communication.csv");
const writeStreamUtilitiesTools = fs.createWriteStream("output/utilities_tools.csv");

[writeStreamBrowsers, writeStreamSecurityPrivacy, writeStreamInternetNetwork, writeStreamSocialCommunication, writeStreamUtilitiesTools].forEach((stream) => {
    stream.write(`Name\tDownloads\tUrl\tAuthor\tLink\n`);
})
// Write Headers

function scrapeIt(url, n, stream) {
    return new Promise((resolveScrapit) => {

        const promises = [];
        
        request(
            `${url}${n}`,
            (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
    
                    $(".app-list-item").each(function(i, el) {
                        const appName = $(el)
                            .find("h2")
                            .text()
                            .trim();
                        const appDownloads = parseInt($(el)
                            .find(".rating-score + div + div")
                            .text()
                            .replace(/M/, "000000")
                            .replace(/K/, "000"));
                        const appUrl = $(this)
                            .parent()
                            .attr("href");
    
                        let appAuthorName,
                            appInfoLink;
                            
                        promises.push(new Promise((resolveScrapAuthor) => {
                            request(appUrl, 
                                (err, res, html) => {
                                    
                                    if (!err && res.statusCode == 200) {
                                        const $ = cheerio.load(html);
                                        appAuthorName = $(".app-specs__description a strong").text();
                                        appInfoLink = $(".app-specs__description a").attr("href");
                                    }
        
                                    // console.log(appName, appDownloads, appUrl, appAuthorName || "Not Specified", appInfoLink || "Not Specified");
                                    stream.write(`${appName}\t${appDownloads}\t${appUrl}\t${appAuthorName || "Not Specified"}\t${appInfoLink || "Not Specified"}\n`);
                                    
                                    resolveScrapAuthor();
                                }); 
                        }))
               
                    });

                    Promise.all(promises).then(() => resolveScrapit());
                }
            }
        );    
    })
}

(async () => {
    for (let i = 1; i <= 10; i++) {
        console.log(`Processing ${i}`);
      
        await scrapeIt("https://en.softonic.com/windows/browsers:weekly-downloads/", i, writeStreamBrowsers);
        console.log("\tBrowsers Done!");
        await scrapeIt("https://en.softonic.com/windows/security-privacy:weekly-downloads/", i, writeStreamSecurityPrivacy);
        console.log("\tSecurity & Privacy Done!");
        await scrapeIt("https://en.softonic.com/windows/internet-network:weekly-downloads/", i, writeStreamInternetNetwork);
        console.log("\tInternet & Network Done!");
        await scrapeIt("https://en.softonic.com/windows/social-communication:weekly-downloads/", i, writeStreamSocialCommunication);
        console.log("\tSocial & Communication Done!");
        await scrapeIt("https://en.softonic.com/windows/utilities-tools:weekly-downloads/", i, writeStreamUtilitiesTools);
        console.log("\tUtilities & Tools Done!");
    }
})();
