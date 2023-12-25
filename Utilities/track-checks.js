// Base DC of your check
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
         // type of roll, you can make it public, for example
         rollMode: "blindroll",
         silent: true,
         // type of saving throw. You can change it to any other skill or saving throw
         request: "fortitude",
         // true, if you want to resolve it after request
         fastForward: true,
         // the DC
         dc: currentColdDC,
      })
   )

   // that whole complicated stuff is designed to print in chat character's current resists against, in this case, cold. It checks every character for any NOTES in their Fortitude saving throws, if it finds notes, it parses it for notes that contain cold or weather. And then it prints these resists so you can count them when calculating the total saving throw result.
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
                     : "No cold weather/damage resist."
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

// Text. You can change it as you wish!
const checkSevereCold = game.Gametime.doEvery({ minutes: 60 }, () => {
   new Dialog({
      title: "It's cold!",
      content: `Characters must make a Fortitude save with the DC of ${currentColdDC}`,
      buttons: {
         savingThrow: {
            label: "Check Fortitude for all",
            callback: () => savingThrow(),
         },
         stopCheck: {
            label: "Stop checking",
            callback: () => stopSevereColdCheck(),
         },
         savingThrowAndStopCheck: {
            label: "Saving throw and stop checking",
            callback: () => savingThrowAndStopCheck(),
         },
      },
   }).render(true)
})
