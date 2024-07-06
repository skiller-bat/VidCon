browser.commands.onCommand.addListener(command => {

    getActiveTab().then(tab => {
        getTabData(tab.id).then(data => {
            if (!data) {
                data = { scale: 1, xOffset: 0, yOffset: 0 }
            }
            updateData(data, command)
            browser.storage.session.set({ [tab.id]: data })
            injectScript(tab.id, data)
        })
    })
})

function injectScript(tabId, data) {

    browser.scripting.executeScript({
        target: {
            tabId: tabId,
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
        args: Object.values(data)
    })
}

function getActiveTab() {
    return browser.tabs.query({ active: true, currentWindow: true })
        .then(tabs => {
            console.assert(tabs.length === 1)
            return tabs[0]
        })
}

async function getTabData(tabId) {
    return browser.storage.session.get(tabId.toString())
        .then(x => {
            return x[tabId]
        })
}

function updateData(data, command) {
    switch (command) {
        case 'move-right':
            data.xOffset += 10
            break
        case 'move-left':
            data.xOffset -= 10
            break
        case 'move-up':
            data.yOffset -= 10
            break
        case 'move-down':
            data.yOffset += 10
            break
        case 'scale-up':
            data.scale += 0.05
            break
        case 'scale-down':
            data.scale -= 0.05
            break
        case 'reset':
            data.scale = 1
            data.xOffset = 0
            data.yOffset = 0
            break
        case 'unknown':
            data.scale = Math.random() + 0.5
            data.xOffset = (Math.random() - 0.5) * 500
            data.yOffset = (Math.random() - 0.5) * 500
            break
    }
}

