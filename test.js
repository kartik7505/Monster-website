const fetch = require('node-fetch');

async function test() {
    const lat = 28.6139;
    const lon = 77.2090; // Delhi
    
    const overpassQuery = `
          [out:json];
          (
            node["shop"="supermarket"](around:10000,${lat},${lon});
            node["shop"="convenience"](around:10000,${lat},${lon});
          );
          out body 15;
        `;
        
    try {
        const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: overpassQuery
        });
        const text = await overpassRes.text();
        console.log(text);
    } catch(e) {
        console.error(e);
    }
}
test();
