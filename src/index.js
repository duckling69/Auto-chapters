import axios from 'axios'

async function getTranscript(videoId){
    const {data : html} = await axios.get('https://www.youtube.com/watch?v=' + videoId)
    const [,url] = html.match(/playerCaptionsTracklistRenderer":\{"captionTracks":\[\{"baseUrl":"(.*?)",/);
    console.log(url)
    //const {data :  xml} = await axios.get(url);
    
    
}
getTranscript('2rWejGnySVY')