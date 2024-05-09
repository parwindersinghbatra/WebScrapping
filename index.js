const axios = require('axios');
const xlsx = require('xlsx');
const cheerio = require('cheerio');
const fs = require('node:fs');

const pageUrl = "https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch"

const headers = {
    "Content-Type": "text/html"
}

const getWebPageData = async (url) =>{
    try{
        const response  = await axios.get (url, {
            headers,
        })
        const strData = response.data
        fs.writeFileSync("webpage.txt", strData)

        console.log(response)
    }catch(e){
        console.error(e)
    }
}
// getWebPageData(pageUrl)

const getDataFromFile = () =>{
    return fs.readFileSync("webpage.txt", {encoding: "utf-8"})
}

   const pageHTMLStrig  = getDataFromFile()

    const $ = cheerio.load(pageHTMLStrig)

    const jobDetails = []   

        $(".jobCard_jobCard__jjUmu.white-box-border.jobCard").each((index, element) => {
            const jobName = $(element).find("strong > h2").text()
            const companyName = $(element).find(".jobCard_jobCard_cName__mYnow").text()
            const location = $(element).find(".jobCard_jobCard_lists_item__YxRkV.jobCard_locationIcon__zrWt2").text()
            const jobType = $(element).find(".jobCard_jobCard_jobDetail__jD82J > li").text()
            const postedDate = $(element).find(".jobCard_jobCard_features__wJid6 > span").text()
            const jobDescription = $(element).find(".JSRP_blog").text()
            
            // jobDetails.push(jobName, companyName, location, jobType, postedDate, jobDescription)
            jobDetails.push({
                jobName: jobName,
                companyName: companyName,
                location: location,
                jobType: jobType,
                postedDate: postedDate,
                jobDescription: jobDescription
            });
         })

         const products = [];
        
         jobDetails.forEach(job => {
            products.push({
                Job_Name: job.jobName,
                Company_Name: job.companyName,
                Location: job.location,
                Job_Type: job.jobType,
                Posted_Date: job.postedDate
            });
        });
        
        console.log(products);

const excelFile = xlsx.utils.book_new()
const excelSheets = xlsx.utils.json_to_sheet(products)

xlsx.utils.book_append_sheet(excelFile, excelSheets, "JobsDetails")
xlsx.writeFile(excelFile,"JobsDetails.xlsx")