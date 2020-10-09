"use strict";

class CommonUtitlity {
    static ComputeHash(str) {
        var hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * return a integer number less than max
     * @param max 
     */
    static getRandomInt(max: number, min = 0) {
        //return Math.floor(Math.random() * Math.floor(max));

        // https://stackoverflow.com/a/41452318/1247872
        let range = max - min;
        if (range <= 0) {
            //throw ('max must be larger than min');
            const tmp = max;
            max = min;
            min = tmp;
            range = -range;
        }
        
        var requestBytes = Math.ceil(Math.log2(range) / 8);
        if (!requestBytes) { // No randomness required
            return min;
        }
        var maxNum = Math.pow(256, requestBytes);
        var ar = new Uint8Array(requestBytes);
    
        while (true) {
            window.crypto.getRandomValues(ar);
    
            var val = 0;
            for (var i = 0;i < requestBytes;i++) {
                val = (val << 8) + ar[i];
            }
    
            if (val < maxNum - maxNum % range) {
                return min + (val % range);
            }
        }
    }

    static getRandomElement(list) {
        const index = CommonUtitlity.getRandomInt(list.length - 1);
        return list[index];
    }

}