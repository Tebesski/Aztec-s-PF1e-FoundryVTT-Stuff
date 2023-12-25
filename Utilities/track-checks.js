let currentColdDC = 15

function stopSevereColdCheck() {
   game.Gametime.clearTimeout(checkSevereCold)
}

function savingThrow() {
   canvas.tokens.releaseAll()

   const tokens = canvas.tokens.placeables.filter(
      (t) => t.actor?.type === "character" && t.actor?.hasPlayerOwner
   )

   game.MonksTokenBar.requestRoll(
      tokens,
      (options = {
         rollMode: "blindroll",
         silent: true,
         request: "fortitude",
         fastForward: true,
         dc: currentColdDC,
      })
   )
   //
   tokens.forEach((t) => {
      const allNotes = t.actor.allNotes
      if (allNotes.length > 0) {
         const fort = allNotes
            .map((note) => {
               return note.notes.filter((t) => {
                  return t.subTarget === "fort"
               })
            })
            .filter((a) => a.length > 0)

         const resistCold = fort
            .filter((note) => {
               const regexp = new RegExp(
                  /холод?[а-яё]+|cold?[a-zA-Z]+|weather/gi
               )
               console.log(note)
               return regexp.test(note[0].text)
            })
            .map((obj) => {
               return obj[0].text
            })

         setTimeout(() => {
            ChatMessage.create({
               content: `${
                  resistCold.length >= 1
                     ? resistCold
                     : "Нет сопротивления холоду."
               }`,
               speaker: { alias: `${t.name}` },
            })
         }, 0)
      }
   })
   //
   currentColdDC++
}

function savingThrowAndStopCheck() {
   savingThrow()
   stopSevereColdCheck()
}

const checkSevereCold = game.Gametime.doEvery({ minutes: 60 }, () => {
   new Dialog({
      title: "Холодрыга",
      content: `Персонажи должны сделать проверку Стойкости со СЛ ${currentColdDC}`,
      buttons: {
         savingThrow: {
            label: "Проверка Стойкости",
            callback: () => savingThrow(),
         },
         stopCheck: {
            label: "Остановить проверки",
            callback: () => stopSevereColdCheck(),
         },
         savingThrowAndStopCheck: {
            label: "Спасбросок и остановка проверок",
            callback: () => savingThrowAndStopCheck(),
         },
      },
   }).render(true)
})
