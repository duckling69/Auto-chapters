import axios from 'axios'

async function getTranscript(videoId){
    const {data : html} = await axios.get('https://www.youtube.com/watch?v=' + videoId)
    let [,url] = html.match(/playerCaptionsTracklistRenderer":\{"captionTracks":\[\{"baseUrl":"(.*?)",/);
    
    if(url){
       url = url.replaceAll('\\u0026', '&'); 
       const {data :  xml} = await axios.get(url);
       console.log(xml);
    }else{
       console.log("caption not found");
    }
    
    
    
}
getTranscript('WVOiDcFUg_I')