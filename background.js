
let scale = 1;
let xOffset = 0;
let yOffset = 0;


browser.commands.onCommand.addListener((command) => { // command: string
    switch (command) {
        case 'move-right':
            xOffset += 10;
            break;
        case 'move-left':
            xOffset -= 10;
            break;
        case 'move-up':
            yOffset -= 10;
            break;
        case 'move-down':
            yOffset += 10;
            break;
        case 'scale-up':
            scale += 0.05;
            break;
        case 'scale-down':
            scale -= 0.05;
            break;
        case 'reset':
            scale = 1;
            xOffset = 0;
            yOffset = 0;
            break;
        case 'unknown':
            scale = Math.random() + 0.5;
            xOffset = (Math.random() - 0.5) * 500;
            yOffset = (Math.random() - 0.5) * 500;
            break;
    }
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            run(tabs[0]);
        }
    });
});

function run(tab) {

    console.log(tab.url);

    browser.tabs.executeScript({
        code: `console.log(document.getElementsByTagName('video'))`
    });

    // if (tab.url.startsWith("https://..."))
    console.log(`${xOffset}|${yOffset} @ ${scale}`);
    browser.tabs.executeScript(/*tab.id,*/ { // tab.id is optional
        code: `document.getElementsByTagName('video')[0].style.setProperty('transform', 'scale(${scale}) translate(${xOffset}px, ${yOffset}px)')`
    });
}
