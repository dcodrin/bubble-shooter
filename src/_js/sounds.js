import BubbleShoot from './BubbleShoot.js';

const Sounds = (function () {
    let soundObjects = [],
        length = 100,
        curSoundNum = 0;
    for(let i = 0; i < length; i += 1){
        soundObjects.push(new Audio());
    }

    const sounds = {
        play: function (url, volume) {
            const sound = soundObjects[curSoundNum];
            sound.src = url;
            sound.volume = volume;
            sound.play();
            curSoundNum += 1;
            if(curSoundNum >= soundObjects.length){
                curSoundNum = curSoundNum % soundObjects.length;
            }
        }
    };
    return sounds;
})();

export default Sounds;