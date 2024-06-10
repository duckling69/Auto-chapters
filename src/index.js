import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'

function parseHtmlEntities(str) {
   return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
       var num = parseInt(numStr, 10); // read num as normal number
       return String.fromCharCode(num);
   });
}

function padNumber(value){
   return value.toString().padStart(2, '0');
}

const ignore = ['(music)', '(applause)', '(laughter)', '(cheering)', '(singing)', '(applause)', '(music playing)']

async function getTranscript(videoId){
    const {data : html} = await axios.get('https://www.youtube.com/watch?v=' + videoId)
    let [,url] = html.match(/playerCaptionsTracklistRenderer":\{"captionTracks":\[\{"baseUrl":"(.*?)",/);
    let srtText = ''
    if(url){
       url = url.replaceAll('\\u0026', '&'); 
       const {data :  xml} = await axios.get(url);
       const $ = cheerio.load(xml);
       
       $('transcript text').each((i,el)=>{
         const $el = $(el);
         const text = parseHtmlEntities($el.text());
         if(ignore.includes(text)) return;
         const start = Number($el.attr('start'));
         const dur = Number($el.attr('dur'));
         const seconds = Math.floor(start % 60);
         const minutes = Math.floor(start / 60 % 60);
         const hours = Math.floor(start / 3600);
         const timestamp = [hours, minutes, seconds].map(padNumber).join(':');
         srtText += `${timestamp}\n${text}\n`
         
       });
       fs.promises.writeFile('transcript.srt', srtText, 'utf-8')

    }else{
       console.log("caption not found");
    }
    
    
    
}
getTranscript('WVOiDcFUg_I')