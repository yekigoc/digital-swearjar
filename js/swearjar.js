var blockchain_guid = '';
var blockchain_api_code = '';
var blockchain_api = 'https://blockchain.info/merchant/';

var BlockChain = (function() {
    function BlockChain() {
        this.guid = guid;
        this.api = 'https://blockchain.info/merchant/';
        this.api_code = api_code;
    };

    BlockChain.prototype.send = function(address, amount, note) {
        var params = {
            password: this.password,
            to: address,
            amount: amount,
            from: this.address,
            note: note
        }

        this.request('payment', params, function(response) {
            console.log('payment callback', response);
        });
    };

    BlockChain.prototype.login = function(address, password) {};

    BlockChain.prototype.get = function(address) {
        var params = {
            password: this.password,
            address: address,
            confirmations: 0
        }

        this.request('address_balance', params, function(response) {
            console.log('address_balance callback', response);
        });
    };

    BlockChain.prototype.create = function(password, label) {
        var params = {
            password: password,
            label: label
        }

        this.request('new_address', params, function(response) {
            console.log('new_address callback', response);
        });

        // send api request + return response
        this.address = response.address;
        this.link = response.link;
    };

    BlockChain.prototype.createWallet = function(password, email) {
        var xhr = new XMLHttpRequest();
        var params = {
            password: password,
            api_code: this.api_code,
            email: email
        };
        var request = Object.keys(params).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) }).join('&');        
        
        xhr.open("POST", 'https://blockchain.info/api/v2/create_wallet?', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            console.log('CREATENEWWALLET',JSON.parse(xhr.responseText));
            if (xhr.readyState == 4 && xhr.status == 200) {
                //return address, guid, and link. 
            }
        }

        xhr.send(request);
    }

    BlockChain.prototype.request = function(action, params, callback) {
        var xhr = new XMLHttpRequest();
        var request = Object.keys(params).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) }).join('&');        
        
        xhr.open("POST", this.api+this.guid+'/'+action+'?', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            console.log('get',JSON.parse(xhr.responseText));
            if (xhr.readyState == 4 && xhr.status == 200) {
                   
            }
            callback(JSON.parse(xhr.responseText));
        }

        xhr.send(request);
    };

    return BlockChain;

})();

/* a digital swear jar using bitcoin */
var DigitalSwearJar = (function() {

    function DigitalSwearJar() {
        /* Set up swear jar presets */

        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser does not support speech recognition");
            return;
        }
        /* Set up html 5 webkit speech recognition */
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        /* Speech recognition events and callbacks */
        this.recognition.onstart = function() {
          console.log("Now listening...");
        };

        this.recognition.onerror = function(e) {
          console.log("Error:", e);
        };

        this.recognition.onend = function() {
          console.log("Stopped listening.");
        };


        // Find a way to break down voice into chunks rather than
        // an accumulating string
        this.recognition.onresult = function(event){

            // This is annoying javascript crap
            if (event.results && event.results[0] && event.results[0][0]) {
                var transcript = event.results[0][0].transcript;
                var confidence = event.results[0][0].confidence;
            }

            // Unavoidable profanity filtering has us matching for the string '***'
            if (transcript.search(/\*+/) && confidence > 0.75) {
                // event.results[0] is always the highest confidence transcript                
                console.log(event.results[0][0].transcript;    
                this.recognition.stop();
                this.blockchain.send(this.jar, this.amount, 'I was caught saying "'+transcript.match(/.\*+/)+'"!')
                this.recognition.start();
            }

        };

        /* Set up blockchain stuff */
        this.blockchain = new BlockChain();

    }

    DigitalSwearJar.prototype.start = function() {
        this.recognition.start();
    }

    DigitalSwearJar.prototype.stop = function() {
        this.recognition.stop();
    }

    return DigitalSwearJar;
})();


/* Debugging code */
(function() {
    var recognition = new webkitSpeechRecognition();

    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    

    recognition.onstart = function() {
      console.log("Recognition started");
    };

    recognition.onresult = function(event){
      console.log(event.results[0][0].confidence, event.results[0][0].transcript);
    };

    recognition.onerror = function(e) {
      console.log("Error:", e);
    };

    recognition.onend = function() {
      console.log("Speech recognition ended.");
    };

    return recognition;

})();
