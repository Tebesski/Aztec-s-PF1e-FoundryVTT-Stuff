const targetMacro = "applyBuff"
const params = "deactivate Ablative Barrier from me"

const actor = await canvas.tokens.controlled[0].actor
const hp = await canvas.tokens.controlled[0].actor.system.attributes.hp
const barrier = await actor.items.getName("Ablative Barrier").system.uses.value

await Dialog.prompt({
   title: "Amount of damage:",
   content: "<input id='dmgInput' type='number' value='0' />",
   label: "Apply",
   callback: (html, event) => main(html, event),
})

async function main(html) {
   const dmg = Number(html.find("input#dmgInput").val())

   if (barrier < 1) {
      window.macroChain = window.macroChain?.concat([params]) ?? [params]
      game.macros.find((o) => o.name == targetMacro)?.execute()
      return
   }

   if (hp.value + 5 >= hp.max) {
      await actor.update({
         "system.attributes.hp.value": hp.value + (hp.max - hp.value),
      })

      await actor.update({
         "system.attributes.hp.nonlethal": hp.nonlethal + (hp.max - hp.value),
      })

      actor.items
         .get(actor.system.resources.ablativeBarrier._id)
         .addCharges(-(hp.max - hp.value))

      return
   }

   await actor.update({
      "system.attributes.hp.value": hp.value + Math.min(dmg, 5),
   })
   await actor.update({
      "system.attributes.hp.nonlethal": hp.nonlethal + Math.min(dmg, 5),
   })
   actor.items
      .get(actor.system.resources.ablativeBarrier._id)
      .addCharges(-Math.min(dmg, 5))
}

main()
