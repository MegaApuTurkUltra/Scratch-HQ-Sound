(function (ext) {
    ext._shutdown = function () {};
    ext._getStatus = function () {
        return {
            status: 2,
            msg: 'Ready to No$c0pe'
        };
    };
    var sounds = {};

    var findSound = function (md5) {
        for (x in sounds) {
            if (sounds[x].md5 == md5) return sounds[x];
        }
        return null;
    };

    ext.load_sound = function (name, md5, callback) {
        if (sounds.hasOwnProperty(name)) {
            callback();
            return;
        }
        var s = findSound(md5);
        if (s != null) {
            sounds[name] = s;
            callback();
            return;
        }
        var obj = {
            md5: md5,
            percent: 0,
            audio: null
        };
        sounds[name] = obj;

        var audio = new window.Audio();
        audio.onended = function () {
            this.currentTime = 0;
        };

        var xhr = new XMLHttpRequest();
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                var percent = (e.loaded / e.total) * 100;
                console.log("Loaded", percent);
                obj.percent = percent;
            }
        };
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                audio.src = window.URL.createObjectURL(xhr.response);
                obj.audio = audio;
                callback();
            }
        };
        xhr.open('GET', "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + md5 + ".wav/get/");
        xhr.responseType = 'blob';
        xhr.send();
    };
	
	ext.load_sound_url = function (name, url, callback) {
        if (sounds.hasOwnProperty(name)) {
            callback();
            return;
        }
        var s = findSound(md5);
        if (s != null) {
            sounds[name] = s;
            callback();
            return;
        }
        var obj = {
            md5: md5,
            percent: 0,
            audio: null
        };
        sounds[name] = obj;

        var audio = new window.Audio();
        audio.onended = function () {
            this.currentTime = 0;
        };

        var xhr = new XMLHttpRequest();
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                var percent = (e.loaded / e.total) * 100;
                console.log("Loaded", percent);
                obj.percent = percent;
            }
        };
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                audio.src = window.URL.createObjectURL(xhr.response);
                obj.audio = audio;
                callback();
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    };
    
    ext.percent_loaded = function(name){
        if(sounds.hasOwnProperty(name)) return sounds[name].percent;
        else return 0;
    };

    ext.play = function (name) {
        if (sounds.hasOwnProperty(name)) sounds[name].audio.play();
    };

    ext.pause = function (name) {
        if (sounds.hasOwnProperty(name)) sounds[name].audio.pause();
    };

    ext.stop = function (name) {
        if (sounds.hasOwnProperty(name)) {
            sounds[name].audio.pause();
            sounds[name].audio.currentTime = 0;
        }
    };

    ext.set_volume = function (name, volume) {
        if (sounds.hasOwnProperty(name)) {
            sounds[name].audio.volume = volume / 100;
        }
    };

    ext.get_volume = function (name) {
        if (sounds.hasOwnProperty(name)) {
            return sounds[name].audio.volume * 100;
        } else return 0;
    };

    ext.global_stop = function () {
        for (x in sounds) ext.stop(x);
    };

    ext.global_pause = function () {
        for (x in sounds) ext.pause(x);
    };

    ext.global_set_volume = function (volume) {
        for (x in sounds) ext.set_volume(x, volume);
    };

    ext.get_all_sounds = function () {
        var s = [];
        for (x in sounds) {
            s.push(x);
        }
        return s;
    };

    ext.is_enabled = function () {
        return true;
    };
    
    ext.is_playing = function(name){
    	if (sounds.hasOwnProperty(name)) {
            return !(sounds[name].audio.paused);
        } else return false;
    }
    
     ext.get_length = function(name){
    	if (sounds.hasOwnProperty(name)) {
            return sounds[name].audio.duration;
        } else return 0;
    }
    
     ext.get_time = function(name){
    	if (sounds.hasOwnProperty(name)) {
            return sounds[name].audio.currentTime;
        } else return 0;
    }
    
     ext.set_time = function(name, time){
    	if (sounds.hasOwnProperty(name)) {
            sounds[name].audio.currentTime = time;
        }
    }

    var descriptor = {
        blocks: [
            ['b', 'Is Running HQS?', 'is_enabled'],
            ['w', 'Load sound %s %s', 'load_sound', 'sound name', 'md5'],
            ['w', 'Load sound %s from url %s', 'load_sound_url', 'sound name', 'url'],
            ['r', 'Percentage of %s loaded', 'percent_loaded', 'sound name'],
            [' ', 'Play or resume sound %s', 'play', 'sound name'],
            [' ', 'Pause sound %s', 'pause', 'sound name'],
            [' ', 'Stop sound %s', 'stop', 'sound name'],
            [' ', 'Set volume for sound %s to %n', 'set_volume', 'sound name', 100],
            ['r', 'Volume of sound %s', 'get_volume', 'sound name'],
            ['b', 'Is sound %s playing?', 'is_playing', 'sound name'],
            ['r', 'Length of sound %s in seconds', 'get_length', 'sound name'],
            ['r', 'Current position in sound %s in seconds', 'get_time', 'sound name'],
            [' ', 'Set position in sound %s to %n seconds', 'set_time', 'sound name', '5'],
            [' ', 'Stop all sounds', 'global_stop'],
            [' ', 'Pause all sounds', 'global_pause'],
            [' ', 'Set volume of all sounds to %n', 'global_set_volume', 100],
            ['r', 'Get all loaded sounds', 'get_all_sounds']
        ],
        url: "http://scratch.mit.edu/discuss/youtube/dQw4w9WgXcQ/" // yes
    };
    ScratchExtensions.register('High Quality Sounds', descriptor, ext);
})({});
