browser.commands.onCommand.addListener(command => {

    getActiveTab().then(tab => {
        getTabData(tab.id).then(oldData => {
            const newData = updateData(oldData, command)
            injectStyle(tab.id, newData).then(() => {
                if (oldData) {
                    removeStyle(tab.id, oldData)
                }
            })
            browser.storage.session.set({ [tab.id]: newData })
        })
    })
})

function injectStyle(tabId, data) {
    return browser.scripting.insertCSS({
        target: {
            tabId: tabId
        },
        css: `video { transform: scale(${data.scale}) translate(${data.xOffset}px, ${data.yOffset}px); }`
    })
}

function removeStyle(tabId, data) {
    return browser.scripting.removeCSS({
        target: {
            tabId: tabId
        },
        css: `video { transform: scale(${data.scale}) translate(${data.xOffset}px, ${data.yOffset}px); }`
    })
}

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
    let newData = data ? structuredClone(data) : { scale: 1, xOffset: 0, yOffset: 0 }

    switch (command) {
        case 'move-right':
            newData.xOffset += 10
            break
        case 'move-left':
            newData.xOffset -= 10
            break
        case 'move-up':
            newData.yOffset -= 10
            break
        case 'move-down':
            newData.yOffset += 10
            break
        case 'scale-up':
            newData.scale += 0.05
            break
        case 'scale-down':
            newData.scale -= 0.05
            break
        case 'reset':
            newData.scale = 1
            newData.xOffset = 0
            newData.yOffset = 0
            break
        case 'unknown':
            newData.scale = Math.random() + 0.5
            newData.xOffset = (Math.random() - 0.5) * 500
            newData.yOffset = (Math.random() - 0.5) * 500
            break
    }
    return newData
}
