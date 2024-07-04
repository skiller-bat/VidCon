
let scale = 1
let xOffset = 0
let yOffset = 0
// TODO: tabId -> transformationData: Map<number, {}>

browser.commands.onCommand.addListener((command) => { // command: string
    switch (command) {
        case 'move-right':
            xOffset += 10
            break
        case 'move-left':
            xOffset -= 10
            break
        case 'move-up':
            yOffset -= 10
            break
        case 'move-down':
            yOffset += 10
            break
        case 'scale-up':
            scale += 0.05
            break
        case 'scale-down':
            scale -= 0.05
            break
        case 'reset':
            scale = 1
            xOffset = 0
            yOffset = 0
            break
        case 'unknown':
            scale = Math.random() + 0.5
            xOffset = (Math.random() - 0.5) * 500
            yOffset = (Math.random() - 0.5) * 500
            break
    }

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.assert(tabs.length === 1)
        if (tabs.length !== 1) {
            return
        }
        run(tabs[0])
    })
})

function run(tab) {

    browser.scripting.executeScript({
        target: {
            tabId: tab.id,
        },
        func: (scale, xOffset, yOffset) => {

            // console.log(window.location.href)
            console.log(`${xOffset}|${yOffset} @ ${scale}`)

            const video = document.getElementsByTagName('video')[0]
            console.log(video)

            if (!video) {
                console.info('No video element found.')
                return
            }
            video.style.setProperty('transform', `scale(${scale}) translate(${xOffset}px, ${yOffset}px)`)
        },
        args: [scale, xOffset, yOffset]
    })
}
